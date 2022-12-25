import React, { createRef, Ref, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { motion } from 'framer-motion'

import { v4 as uuid } from 'uuid';


import styles from '../gradient-input.module.scss';
import GradientThumb from '../thumb/GradientThumb';
import { current } from '@reduxjs/toolkit';
import { GradientContextProvider } from 'context/GradientContext';

type Props = {
    settings: GradientSetting,
    colour: string,
    clickCallback?: (id: string, percentage: number, colour: string) => void
    dragCallback?: (id: string, percentage: number, colour: string) => void
}

export type GradientSetting = {
    type: "linear-gradient" | "radial-gradient";
    angle: number;
    gradients: {
        [id: string]: GradientPosition
    }
}

export type GradientPosition = {
    uuid: string
    percentage: number,
    colour: string,
    thumb?: GradientThumbSettings,
    selected?: boolean
}

type GradientThumbSettings = {
    clicked?: boolean,
    ref?: RefObject<HTMLDivElement>
}

export const INITIAL_GRADIENT: GradientSetting = {
    angle: 90,
    type: "linear-gradient",
    gradients: {
        [uuid()]: {
            uuid: "",
            percentage: 0,
            colour: "#000000"
        },
        [uuid()]: {
            uuid: "",
            percentage: 100,
            colour: "#FFFFFF"
        }
    }

}

function GradientSlider({ settings, colour, clickCallback = () => { }, dragCallback = () => { } }: Props)
{
    const ref = useRef<HTMLDivElement>(null)

    const [set, setSettings] = useState(settings);
    const [thumbs, setThumbs] = useState<React.ReactNode[]>([]);

    const [selected, setSelected] = useState("");

    const addGradient = (grad: GradientPosition) =>
    {
        setSettings(prev =>
        {
            grad.selected = true;
            setSelected(grad.uuid)
            return {
                ...prev,
                gradients: {
                    ...prev.gradients,
                    [grad.uuid]: grad
                }
            }
        })
    }

    const updatePercentage = (uuid: string, percentage: number) =>
    {
        let temp = set.gradients;
        temp[uuid].percentage = percentage;

        dragCallback(uuid, percentage, temp[uuid].colour)

        setSettings(prev => { return { ...prev, gradients: temp } })
    }

    const updateColour = (uuid: string, colour: string) =>
    {

        let temp = set.gradients;
        temp[uuid].colour = colour;

        dragCallback(uuid, temp[uuid].percentage, temp[uuid].colour)

        setSettings(prev => { return { ...prev, gradients: temp } })
    }

    const setSelectedGradient = (uuid: string) =>
    {
        let temp = set.gradients;
        temp[uuid].selected = !temp[uuid].selected;
        setSelected(prev => prev === uuid ? "" : uuid)
        setSettings(prev => { return { ...prev, gradients: temp } })
    }

    const click = (e: React.MouseEvent<HTMLDivElement>) =>
    {
        let width = e.currentTarget.getBoundingClientRect().width;
        let x = (e.clientX - e.currentTarget.getBoundingClientRect().left)
        let percentage = (x / width) * 100

        let id = uuid();

        addGradient({ colour: colour, percentage: percentage, uuid: id })
        clickCallback(id, percentage, colour)
    }

    const drag = (id: string, percentage: number, width: number) =>
    {
        updatePercentage(id, percentage);
    }

    const select = (uuid: string) =>
    {
        setSelectedGradient(uuid)
    }

    useEffect(() =>
    {
        setThumbs(toArray(set.gradients).map((e) =>
        {
            return (
                <GradientThumb
                    selected={e.uuid === selected}
                    gradient={e}
                    width={ref?.current?.getBoundingClientRect().width ?? 0}
                    callback={drag}
                    onClick={select}
                />
            )
        }))
    }, [ref.current?.getBoundingClientRect, set.gradients, selected])

    useEffect(() =>
    {
        if (selected.length === 0) return;
        let hasSelected = Object.keys(settings.gradients).includes(selected)

        hasSelected && updateColour(selected, colour)
    }, [colour])

    return (
        <div ref={ref} className={styles["gradient-slider"]} style={{ background: getGradientCSS({ ...set, angle: 90 }) }} onClick={click}>
            {thumbs}
        </div>
    )
}

function toArray(grads: { [id: string]: GradientPosition })
{
    let array: GradientPosition[] = [];
    for (let index = 0; index < Object.keys(grads).length; index++)
    {
        const key = Object.keys(grads)[index];

        grads[key].uuid = key;
        array.push(grads[key])

    }
    return array;
}

function sort(a: GradientPosition, b: GradientPosition)
{
    return a.percentage - b.percentage;
}

function getColour(x: number, width: number, gradients: GradientPosition[])
{
    let grads: any[] = [];
    for (let index = 0; index < gradients.length; index++)
    {
        const e = gradients[index];
        if (x <= e.percentage)
        {
            grads = [index - 1, index]
        }
    }


    var firstcolor = hexToRgb(gradients[grads[0]].colour) ?? [0, 0, 0];
    var secondcolor = hexToRgb(gradients[grads[1]].colour) ?? [255, 255, 255];

    var firstcolor_x = width * (gradients[grads[0]].percentage / 100);
    var secondcolor_x = width * (gradients[grads[1]].percentage / 100) - firstcolor_x;
    var slider_x = width * (x / 100) - firstcolor_x;
    var ratio = slider_x / secondcolor_x


    return pickHex(secondcolor, firstcolor, ratio);
}

function pickHex(color1: number[], color2: number[], weight: number)
{
    var p = weight;
    var w = p * 2 - 1;
    var w1 = (w / 1 + 1) / 2;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
    Math.round(color1[1] * w1 + color2[1] * w2),
    Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgbToHex(rgb);
}

export function getGradientCSS({ angle, type, gradients }: GradientSetting)
{
    let css = "";
    const sortedGradients = toArray(gradients).sort(sort)

    for (let index = 0; index < sortedGradients.length; index++)
    {
        const grad = sortedGradients[index];
        css = css + toGradientCSS(grad) + (sortedGradients.length - 1 === index ? "" : ", ");
    }


    return `${type}(${angle}deg, ${css})`
}

export function toGradientCSS(gradient: GradientPosition)
{
    return `${gradient.colour} ${gradient.percentage}%`
}

function componentToHex(c: number)
{
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function hexToRgb(hex: string)
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : null;
}

function rgbToHex(rgb: number[])
{
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

export default GradientSlider