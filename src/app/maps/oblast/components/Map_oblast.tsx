'use client';
import React, { useRef, useEffect } from 'react';
import geoData from '../../gadm41_KGZ_1.json';
import type { FeatureCollection, Feature, Geometry, MultiPolygon, GeoJsonProperties } from 'geojson';
import * as d3 from 'd3';

interface GeoFeature extends Feature<MultiPolygon, GeoJsonProperties> {
  geometry: MultiPolygon;
  properties: {
    NAME_1: string;
  } & GeoJsonProperties;
}

// Добавляем типизацию для координат
type Oblast = {
  id: number;
  name: string;
  ratings: number[];
  coordinates: [number, number]; // Явно указываем, что это кортеж из двух чисел
};

// Данные об областях с координатами центров для точек
const oblasts: Oblast[] = [
  { id: 2, name: 'Чуйская область', ratings: [0, 0, 0, 0, 0, 0, 0], 
    coordinates: [74.70, 42.70] },
  { id: 3, name: 'Таласская область', ratings: [3.5, 2.5, 2.1, 1.3, 2.5, 2.1, 888], 
    coordinates: [72.50, 42.50] },
  { id: 4, name: 'Иссык-Кульская область', ratings: [0, 0, 0, 0, 0, 0, 0], 
    coordinates: [77.50, 42.20] },
  { id: 5, name: 'Нарынская область', ratings: [4.3, 3.8, 3.9, 4.0, 4.1, 4.2, 555], 
    coordinates: [75.50, 41.50] },
  { id: 6, name: 'Джалал-Абадская область', ratings: [4.1, 3.7, 3.8, 3.9, 4.0, 4.1, 444], 
    coordinates: [72.50, 41.50] },
  { id: 7, name: 'Ошская область', ratings: [3.3, 3.7, 3.8, 3.9, 4.0, 4.1, 333], 
      coordinates: [73.50, 40.50] },
  { id: 7, name: 'Баткенская область', ratings: [3.3, 3.7, 3.8, 3.9, 4.0, 4.1, 333], 
    coordinates: [70.00, 39.80] }
];

const oblastMapping: { [key: string]: string } = {
  'Bishkek': 'г. Бишкек',
  'Chuy': 'Чуйская область',
  'Talas': 'Таласская область',
  'Issyk-Kul': 'Иссык-Кульская область',
  'Naryn': 'Нарынская область',
  'Jalal-Abad': 'Джалал-Абадская область',
  'Batken': 'Баткенская область',
  'Osh': 'Ошская область'
};

export default function Map_oblast() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const getOblastRating = (oblastName: string): number => {
    const mappedName = oblastMapping[oblastName];
    const oblast = oblasts.find(o => o.name === mappedName);
    return oblast ? oblast.ratings[0] : 0;
  };

  const getColor = (properties: any): string => {
    if (properties.NAME_1 === 'Ysyk-Köl(lake)' || 
        properties.NAME_1 === 'Ysyk-Kol' || 
        properties.NAME_1 === 'Issyk-Kul Lake') {
      return '#4FA1E3';
    }
    
    const rating = getOblastRating(properties.NAME_1);
    
    if (rating >= 4.5) return '#00FFFF';      // Темно-зеленый
    if (rating >= 4.0) return '#4ade80';      // Зеленый
    if (rating >= 3.5) return '#FFFF00';      // Светло-зеленый
    if (rating >= 3.0) return '#bbf7d0';      // Очень светло-зеленый
    return '#FF7074';                         // Почти белый
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 750;
    const height = 400;
    
    svg.attr('viewBox', [0, 0, width, height])
       .attr('width', width)
       .attr('height', height);

    const projection = d3.geoMercator()
      .center([74, 41.5])
      .scale(3000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'absolute hidden bg-white p-2 rounded shadow-lg text-sm border border-gray-200')
      .style('pointer-events', 'none');

    svg.selectAll('*').remove();

    // Рисуем области
    svg.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', (d: any) => path(d)) // Исправлено: добавлен тип для параметра d
      .attr('fill', (d: any) => getColor(d.properties)) // Исправлено: добавлен тип для параметра d
      .attr('stroke', '#fff')
      .attr('stroke-width', '1')
      .on('mouseover', function(event: MouseEvent, d: any) { // Исправлено: добавлен тип для параметра event
        d3.select(this)
          .attr('stroke-width', '2')
          .attr('stroke', '#000');

        const [x, y] = d3.pointer(event, document.body);
        const rating = getOblastRating(d.properties.NAME_1);
        const mappedName = oblastMapping[d.properties.NAME_1];

        tooltip
          .style('display', 'block')
          .style('left', `${x + 10}px`)
          .style('top', `${y + 10}px`)
          .html(`
            <div class="font-medium">${mappedName || d.properties.NAME_1}</div>
            <div class="text-sm text-gray-600">Общая оценка: ${rating.toFixed(1)}</div>
          `);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke-width', '1')
          .attr('stroke', '#fff');
        tooltip.style('display', 'none');
      });

    // Добавляем точки и рейтинги
    oblasts.forEach(oblast => {
      const coordinates = projection(oblast.coordinates);
      if (coordinates && Array.isArray(coordinates)) {
        const [x, y] = coordinates;

        // Добавляем точку
        svg.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 4)
          .attr('fill', '#ef4444')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);

        // Добавляем текст с рейтингом
        svg.append('text')
          .attr('x', x)
          .attr('y', y - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', '#000')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text(oblast.ratings[0].toFixed(1));
      }
    });

  }, []);

  return (
    <svg ref={svgRef} className="w-full h-auto"></svg>
  );
}