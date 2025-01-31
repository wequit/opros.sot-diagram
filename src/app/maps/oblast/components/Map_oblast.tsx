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

// Добавляем интерфейс для данных области
interface OblastData {
  id: number;
  name: string;
  ratings: number[];
  coordinates: [number, number]; // Добавляем тип для координат
}

interface MapProps {
  selectedOblast: string | null;
  oblastData: OblastData[]; // Используем новый интерфейс
}

export default function Map_oblast({ selectedOblast, oblastData }: MapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Маппинг для соответствия названий из JSON и наших данных
  const oblastMapping: { [key: string]: string } = {
    'Biškek': 'Верховный суд Кыргызской Республики',
    'Chüy': 'Суды Чуйской области',
    'Talas': 'Суды Таласской области',
    'Ysyk-Köl': 'Суды Иссык-Кульской области',
    'Naryn': 'Суды Нарынской области',
    'Jalal-Abad': 'Суды Жалал-Абадской области',
    'Batken': 'Суды Баткенской области',
    'Osh': 'Суды Ошской области'
  };

  const getOblastRating = (oblastName: string): number => {
    const mappedName = oblastMapping[oblastName];
    const oblast = oblastData.find(o => o.name === mappedName);
    return oblast ? oblast.ratings[0] : 0;
  };

  const getColor = (properties: any): string => {
    if (properties.NAME_1 === 'Ysyk-Köl(lake)' || 
        properties.NAME_1 === 'Ysyk-Kol' || 
        properties.NAME_1 === 'Issyk-Kul Lake') {
      return '#4FA1E3';
    }
    
    const rating = getOblastRating(properties.NAME_1);
    
      if (rating >= 4.5) return '#8fce00';     
      if (rating >= 4.0) return '#38761d';     
      if (rating >= 3.5) return '#ffe599';     
      if (rating >= 3.0) return '#bf9000';     
      if (rating === 0) return '#999999';      
      return '#FF7074';                        
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
      .attr('d', (d: any) => path(d))
      .attr('fill', (d: any) => {
        // Если область выбрана, делаем все остальные прозрачными
        if (selectedOblast) {
          const mappedName = oblastMapping[d.properties.NAME_1];
          return mappedName === selectedOblast ? 
            getColor(d.properties) : 
            'rgba(200, 200, 200, 0.3)';
        }
        return getColor(d.properties);
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', '1')
      .attr('transition', 'fill 0.3s ease')
      .on('mouseover', function(event: MouseEvent, d: any) { // Исправлено: добавлен тип для параметра event
        d3.select(this)
          .attr('stroke-width', '2')
          .attr('stroke', '#b45f06');

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
    oblastData.forEach((oblast: OblastData) => {
      const coordinates = projection(oblast.coordinates);
      if (coordinates && Array.isArray(coordinates)) {
        const [x, y] = coordinates;

        // Добавляем точку
        svg.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 3)
          .attr('fill', '#990000')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5);

        // Добавляем текст с рейтингом
        svg.append('text')
          .attr('x', x)
          .attr('y', y - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', '#000')
          .attr('font-size', '10px')
          .attr('font-weight', 'normal')
          .text(oblast.ratings[0].toFixed(1));
      }
    });

    // Добавляем легенду
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(20, 20)`);

    const legendData = [
      { color: '#8fce00', label: '4.5 и выше' },
      { color: '#38761d', label: '4.0 - 4.4' },
      { color: '#ffe599', label: '3.5 - 3.9' },
      { color: '#bf9000', label: '3.0 - 3.4' },
      { color: '#FF7074', label: 'Ниже 3.0' },
      { color: '#999999', label: 'Нет данных' }
    ];

    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 15})`); // Уменьшил отступ между строками

    legendItems.append('rect')
      .attr('width', 12) // Уменьшил размер прямоугольников
      .attr('height', 12)
      .attr('fill', d => d.color);

    legendItems.append('text')
      .attr('x', 16)
      .attr('y', 9)
      .text(d => d.label)
      .attr('class', 'text-xs fill-gray-700'); // Уменьшил размер текста

  }, [selectedOblast, oblastData]);

  return (
    <svg ref={svgRef} className="w-full h-auto"></svg>
  );
}