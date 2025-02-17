'use client';
import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import * as d3 from 'd3';
import geoData from '../../../../../public/gadm41_KGZ_1.json';
import type { FeatureCollection, Feature, Geometry, MultiPolygon, GeoJsonProperties } from 'geojson';
import { getAssessmentData } from '@/api/login';
import { getCookie } from '@/api/login';

interface SVGFeature {
  type: string;
  properties: {
    NAME_1: string;
    GID_1: string;
    GID_0: string;
    COUNTRY: string;
    VARNAME_1: string;
    NL_NAME_1: string;
    TYPE_1: string;
    ENGTYPE_1: string;
    CC_1: string;
    HASC_1: string;
    ISO_1: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][][];
  };
}

// Координаты для каждой области
const oblastCoordinates: { [key: string]: [number, number] } = {
  'Бишкек': [74.69, 42.87],
  'Чуйская область': [74.5, 42.8],
  'Таласская область': [72.2, 42.5],
  'Иссык-Кульская область': [77.5, 42.3],
  'Нарынская область': [75.5, 41.3],
  'Жалал-Абадская область': [72.5, 41.5],
  'Баткенская область': [71.5, 40.0],
  'Ошская область': [73.0, 40.5],
};

interface OblastData {
  id: number;
  name: string;
  ratings: number[];
  overall: number;
}

interface MapProps {
  oblastData: OblastData[];
}

type OblastMapping = {
  [key: string]: string;
};

export default function Map_oblast({ oblastData  }: MapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 480 });

  const oblastMapping: OblastMapping = useMemo(() => ({
    'Biškek': 'Город Бишкек',
    'Chüy': 'Чуйская область',
    'Talas': 'Таласская область',
    'Ysyk-Köl': 'Иссык-Кульская область',
    'Naryn': 'Нарынская область',
    'Jalal-Abad': 'Жалал-Абадская область',
    'Batken': 'Баткенская область',
    'Osh': 'Ошская область'
  }), []);

  const getOblastRating = useCallback((oblastName: string) => {
    const mappedName = oblastMapping[oblastName] || oblastName;
    const oblast = oblastData.find(o => o.name === mappedName);
    return oblast?.overall || 0;
  }, [oblastData, oblastMapping]);

  const getColor = useCallback((rating: number) => {
    if (rating === 0) return '#999999';
    if (rating >= 5.0) return '#66C266';
    if (rating >= 4.5) return '#66C266';
    if (rating >= 4.0) return '#B4D330';
    if (rating >= 3.5) return '#FFC04D';
    if (rating >= 3.0) return '#F4A460';
    if (rating >= 2.5) return '#E57357';
    if (rating >= 2.0) return '#ff620d';
    if (rating >= 1.5) return '#fa5d5d';
    if (rating >= 1.0) return '#fa5d5d';
    if (rating >= 0.5) return '#640202';
    return '#999999';
  }, [ oblastData, oblastMapping]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !oblastData.length) return;

    const container = d3.select(containerRef.current);
    const width = container.node()?.getBoundingClientRect().width || 800;
    const height = width * 0.6;

    setDimensions({ width, height });

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const projection = d3.geoMercator()
      .center([74, 41.5])
      .scale(width * 4)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const regionsGroup = svg.append('g')
      .attr('class', 'regions');

    // Рисуем области
    regionsGroup.selectAll('path')
      .data(geoData.features as SVGFeature[])
      .join('path')
      .attr('d', path as any)
      .attr('class', 'region-path')
      .attr('fill', (d: SVGFeature) => {
        const rating = getOblastRating(d.properties.NAME_1);
        return getColor(rating);
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', '1')
      .style('cursor', 'pointer')
      .on('mouseover', function(event: any, d: SVGFeature) {
        d3.select(this).attr('stroke-width', '2');
        
        const coordinates = getEventCoordinates(event);
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style('display', 'block')
          .style('position', 'fixed')
          .style('left', `${coordinates.x + 10}px`)
          .style('top', `${coordinates.y + 10}px`);

        const mappedName = oblastMapping[d.properties.NAME_1] || d.properties.NAME_1;
        const rating = getOblastRating(d.properties.NAME_1);
        tooltip.html(`
          <div class="font-medium">${mappedName}</div>
          <div>Общая оценка: ${rating.toFixed(1)}</div>
        `);
      })
      .on('mousemove', function(event: any) {
        const coordinates = getEventCoordinates(event);
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style('left', `${coordinates.x + 10}px`)
          .style('top', `${coordinates.y + 10}px`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', '1');
        d3.select(tooltipRef.current).style('display', 'none');
      })
      .on('touchstart', function(event: any, d: SVGFeature) {
        event.preventDefault();
        d3.select(this).attr('stroke-width', '2');
        
        const coordinates = getEventCoordinates(event);
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style('display', 'block')
          .style('position', 'fixed')
          .style('left', `${coordinates.x + 10}px`)
          .style('top', `${coordinates.y + 10}px`);

        const mappedName = oblastMapping[d.properties.NAME_1] || d.properties.NAME_1;
        const rating = getOblastRating(d.properties.NAME_1);
        tooltip.html(`
          <div class="font-medium">${mappedName}</div>
          <div>Общая оценка: ${rating.toFixed(1)}</div>
        `);
      })
      .on('touchmove', function(event: any) {
        event.preventDefault();
        const coordinates = getEventCoordinates(event);
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style('left', `${coordinates.x + 10}px`)
          .style('top', `${coordinates.y + 10}px`);
      })
      .on('touchend', function() {
        d3.select(this).attr('stroke-width', '1');
        d3.select(tooltipRef.current).style('display', 'none');
      })
    

    // Добавляем текст с оценками на карту
    regionsGroup.selectAll('text')
      .data(geoData.features as SVGFeature[])
      .join('text')
      .attr('x', (d: any) => path.centroid(d)[0])
      .attr('y', (d: any) => path.centroid(d)[1])
      .attr('text-anchor', 'middle')
      .attr('class', 'region-label')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .style('pointer-events', 'none')
      .text((d: SVGFeature) => {
        const rating = getOblastRating(d.properties.NAME_1);
        return rating ? rating.toFixed(1) : '';
      });

    // Добавляем легенду
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(20, ${height - 650})`);

    const legendData = [
      { color: '#66C266', label: '4.5 - 5.0' },
      { color: '#B4D330', label: '4.0 - 4.4' },
      { color: '#FFC04D', label: '3.5 - 3.9' },
      { color: '#F4A460', label: '3.0 - 3.4' },
      { color: '#ff8300', label: '2.0 - 2.9' },
      { color: '#ff620d', label: '1.5 - 2.0' },
      { color: '#fa5d5d', label: '1.0 - 1.5' },
      { color: '#640202', label: '0.5 - 1.0' }
    ];

    legend.selectAll('.legend-item')
      .data(legendData)
      .join('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)
      .call(g => {
        g.append('rect')
          .attr('width', 15)
          .attr('height', 15)
          .attr('rx', 2)
          .attr('fill', d => d.color);
        g.append('text')
          .attr('x', 25)
          .attr('y', 12)
          .attr('font-size', '12px')
          .attr('fill', '#666')
          .text(d => d.label);
      });

  }, [oblastData, oblastMapping,  getOblastRating, getColor]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg ref={svgRef} className="w-full h-auto"></svg>
      <div
        ref={tooltipRef}
        className="hidden absolute bg-white border border-gray-200 rounded-md shadow-lg p-2 z-50"
        style={{ pointerEvents: 'none' }}
      ></div>
    </div>
  );
}

function getEventCoordinates(event: any) {
  if (event.touches && event.touches[0]) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }
  if (event.changedTouches && event.changedTouches[0]) {
    return {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY
    };
  }
  return {
    x: event.clientX,
    y: event.clientY
  };
}