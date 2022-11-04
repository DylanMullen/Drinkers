// Next.js API route support: https://nextjs.org/docs/apsi-routes/introduction

import { DynamoDBClient, PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { NextApiRequest, NextApiResponse } from "next";

import { v4 as uuid } from 'uuid';
import OAuth from 'discord-oauth2';

import { setCookie } from 'cookies-next';
import { API_URL } from "settings/Config";

interface Discord
{
  auth: DiscordAuth,
  user: DiscordUser
}

interface Homebrew
{
  email: string,
  password: string
}

type DiscordAuth = {
  accessToken: string,
  refreshToken: string,
  expires: number
}

type DiscordUser = {
  id: string
  username: string,
  email: string,
  avatar: string
}

const discord = new OAuth();
const dynamo = new DynamoDBClient({ region: "eu-west-2", credentials: { accessKeyId: "AKIA5AK7PPREGR5PVWMW", secretAccessKey: "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" } });

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
  if (req.method === "GET" && Object.keys(req.query).length !== 0 && req.query.code !== undefined)
  {
    try
    {
      let userDetails = await loginWithDiscord(req.query.code as string);
      if (userDetails === undefined)
      {
        res.status(403).json({
          error: "Player not found and cannot be created."
        })
        return;
      }

      let date = new Date(userDetails.auth.expires * 1000);

      setCookie("user", userDetails, {
        req,
        res,
        expires: date
      })

      res.redirect("/");
      return;
    } catch (error: any)
    {
      res.status(500).json({ error: error })
      return;
    }
  }
  else if (req.method === "POST")
  {
    loginWithHomebrew(req.body);
  }

  res.redirect("/").json({})

}

async function loginWithDiscord(code: string)
{
  const discordDetails = await getDiscord(code);

  if (discordDetails === undefined)
    return;
  let userDetails
  userDetails = await checkDatabase(discordDetails);

  if (userDetails === undefined)
  {
    let response = await registerDiscordAccount(discordDetails)
    return {
      uuid: response.uuid,
      discordId: response.details.user.id,
      username: response.details.user.username,
      avatar: response.details.user.avatar,
      auth: {
        accessToken: response.details.auth.accessToken,
        expires: response.details.auth.expires
      }
    };
  }
  return {
    uuid: userDetails.uuid,
    discordId: userDetails.details.user.id,
    username: userDetails.details.user.username,
    avatar: userDetails.details.user.avatar,
    auth: {
      accessToken: userDetails.details.auth.accessToken,
      expires: userDetails.details.auth.expires
    }
  };
}

async function loginWithHomebrew(body: JSON)
{

}

/* DISCORD */

async function getDiscord(code: string): Promise<Discord | undefined>
{
  try
  {
    const authDetails = await authDiscord(code);
    const userDetails = await getDiscordUser(authDetails.accessToken);

    return {
      auth: authDetails,
      user: userDetails
    }

  } catch (error)
  {
    return undefined
  }
}

async function authDiscord(code: string): Promise<DiscordAuth>
{
  let response = await discord.tokenRequest({
    clientId: "852274286017249330",
    clientSecret: "chrso7QY82dIOnrt2XcywvrqDuiTyFTN",
    code: code,
    scope: "identify",
    grantType: "authorization_code",
    redirectUri: API_URL.replace("api.", "") + "/api/login"
  })
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    expires: (new Date().getTime() / 1000) + response.expires_in
  }

}

async function getDiscordUser(accessToken: string): Promise<DiscordUser>
{

  let response = await discord.getUser(accessToken)
  return {
    id: response.id,
    username: response.username,
    email: response.email as string,
    avatar: getDiscordAvatar(response.id, response.avatar as string)
  }
}

function getDiscordAvatar(discordID: string, avatarCode: string): string
{
  return `https://cdn.discordapp.com/avatars/${discordID}/${avatarCode}.png`
}

async function checkDatabase(details: Discord | Homebrew)
{
  if ((details as Discord).auth !== undefined)
  {
    let discordDetails = details as Discord;
    let awsResponse = await sendDiscordDatabaseLookup(discordDetails.user.id);

    if (!awsResponse.Items || (awsResponse.Items && awsResponse.Items.length) === 0)
    {
      return undefined;
    }

    await updateDiscordAccount(awsResponse.Items[0].uuid.S as string, discordDetails)

    return {
      uuid: awsResponse.Items[0].uuid.S,
      details: discordDetails
    }

  }
  return undefined;
}

async function sendDiscordDatabaseLookup(discordID: string)
{
  let params: QueryCommandInput = {
    TableName: "users",
    IndexName: "users-discord",
    KeyConditionExpression: "discordId = :id",
    ExpressionAttributeValues: {
      ":id": { S: discordID }
    },
  }
  return await dynamo.send(new QueryCommand(params));
}

async function registerDiscordAccount(discordDetails: Discord)
{
  let userUUID: string = uuid()

  let params: PutItemCommandInput = {
    TableName: "users",
    Item: {
      "uuid": { S: userUUID },
      "email": { S: discordDetails.user.email },
      "discordId": { S: discordDetails.user.id },
      "discord": { S: JSON.stringify(discordDetails.auth) }
    },
  }
  await dynamo.send(new PutItemCommand(params))
  return {
    uuid: userUUID,
    details: discordDetails
  }
}

async function updateDiscordAccount(uuid: string, discordDetails: Discord)
{
  console.log(uuid)
  let params: UpdateItemCommandInput = {
    TableName: "users",
    Key: {
      "uuid": { S: uuid }
    },
    UpdateExpression: "set discord = :discord",
    ExpressionAttributeValues: {
      ":discord": { S: JSON.stringify(discordDetails.auth) }
    }
  }

  return await dynamo.send(new UpdateItemCommand(params));
}