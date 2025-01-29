'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import rayonData from '@/app/maps/gadm41_KGZ_2.json';

export default function Map_rayon() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const width = 800;
    const height = 400; // Уменьшили высоту до такой же как у карты областей

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const projection = d3.geoMercator()
      .center([74.5, 41.5])
      .scale(3200) // Немного уменьшили масштаб для соответствия новой высоте
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    svg.selectAll('path')
      .data((rayonData as any).features)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => getColor(d.properties))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .on('mouseover', function(event, d: any) {
        d3.select(this)
          .attr('fill-opacity', 0.7);

        const tooltip = d3.select(tooltipRef.current);
        
        // Используем clientX и clientY вместо pageX и pageY
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        // Получаем позицию контейнера
        const containerRect = containerRef.current?.getBoundingClientRect();
        const tooltipNode = tooltipRef.current;
        
        if (containerRect && tooltipNode) {
          // Вычисляем позицию относительно контейнера
          let tooltipX = mouseX - containerRect.left;
          let tooltipY = mouseY - containerRect.top;
          
          // Проверяем границы
          const tooltipWidth = tooltipNode.offsetWidth;
          const tooltipHeight = tooltipNode.offsetHeight;
          
          // Если тултип выходит за правый край
          if (tooltipX + tooltipWidth > containerRect.width) {
            tooltipX = tooltipX - tooltipWidth - 10;
          } else {
            tooltipX = tooltipX + 10;
          }
          
          // Если тултип выходит за нижний край
          if (tooltipY + tooltipHeight > containerRect.height) {
            tooltipY = tooltipY - tooltipHeight - 10;
          } else {
            tooltipY = tooltipY + 10;
          }

          tooltip
            .style('display', 'block')
            .style('left', `${tooltipX}px`)
            .style('top', `${tooltipY}px`)
            .html(`
              <div class="font-medium">${d.properties.NAME_2}</div>
              <div class="text-sm text-gray-600">Общая оценка: 0</div>
            `);
        }
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('fill-opacity', 1);

        d3.select(tooltipRef.current)
          .style('display', 'none');
      });

  }, []);

  return (
    <div ref={containerRef} className="relative w-full flex justify-center items-center">
      <div className="w-full max-w-[1200px]">
        <svg ref={svgRef} className="w-full h-auto"></svg>
        <div
          ref={tooltipRef}
          className="absolute hidden bg-white px-2 py-1 rounded-md shadow-lg border border-gray-200 z-10"
          style={{ pointerEvents: 'none' }}
        ></div>
      </div>
    </div>
  );
}

const getRayonRating = (rayonName: string): number => {
  return 0; // Временное значение, будет заменено данными с бэкенда
};

const getColor = (properties: any): string => {
  if (properties.NAME_2 === 'Ysyk-Köl(lake)' || 
      properties.NAME_2 === 'Ysyk-Kol' || 
      properties.NAME_2 === 'Issyk-Kul') {
    return '#4FA1E3'; // Синий для озера
  }
  return '#CBD5E1'; // Серый для остальных районов
};