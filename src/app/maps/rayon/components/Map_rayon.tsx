'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import rayonData from '@/app/maps/gadm41_KGZ_2.json';

// Данные о судах
const courts = [
  { id: 1, name: 'Верховный суд Кыргызской Республики', instance: '3-я инстанция (кассационная)', 
    ratings: [4.8, 4.7, 4.6, 4.8, 4.7, 4.9, 180] },

  // Чуйская область
  { id: 2, name: 'Аламудунский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.2, 3.8, 4.1, 4.3, 4.0, 4.2, 95] },
  { id: 3, name: 'Сокулукский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 4.1, 3.8, 4.0, 4.2, 3.9, 88] },
  { id: 4, name: 'Московский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.7, 4.2, 3.9, 4.1, 4.0, 76] },
  { id: 5, name: 'Жайылский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.8, 4.0, 3.9, 4.1, 3.8, 4.2, 82] },
  { id: 6, name: 'Панфиловский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.9, 4.1, 3.8, 4.0, 3.9, 71] },
  { id: 7, name: 'Кеминский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.7, 4.1, 3.8, 4.0, 3.9, 4.1, 68] },
  { id: 8, name: 'Ысык-Атинский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.8, 4.0, 4.2, 3.9, 4.0, 92] },
  { id: 9, name: 'Чуйский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 4.0, 3.8, 4.1, 4.0, 3.9, 87] },

  // Иссык-Кульская область
  { id: 10, name: 'Ак-Суйский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.9, 4.1, 3.8, 4.0, 3.9, 77] },
  { id: 11, name: 'Джети-Огузский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.8, 4.1, 3.9, 4.0, 3.8, 4.1, 81] },
  { id: 12, name: 'Тонский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 3.8, 4.0, 3.9, 4.1, 3.8, 72] },
  { id: 13, name: 'Тюпский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 3.8, 4.0, 3.9, 4.1, 69] },
  { id: 14, name: 'Иссык-Кульский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 4.1, 3.9, 4.0, 3.8, 4.2, 83] },

  // Нарынская область
  { id: 15, name: 'Ак-Талинский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.8, 4.0, 3.9, 4.1, 3.8, 4.0, 71] },
  { id: 16, name: 'Ат-Башинский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.8, 4.0, 3.9, 4.1, 3.8, 74] },
  { id: 17, name: 'Жумгальский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 4.1, 3.8, 4.0, 3.9, 4.1, 67] },
  { id: 18, name: 'Кочкорский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.9, 4.1, 3.8, 4.0, 3.9, 73] },
  { id: 19, name: 'Нарынский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.8, 4.1, 3.9, 4.0, 3.8, 4.1, 78] },

  // Таласская область
  { id: 20, name: 'Таласский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 3.9, 4.1, 85] },
  { id: 21, name: 'Бакай-Атинский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 4.0, 3.8, 4.1, 4.0, 3.9, 75] },
  { id: 22, name: 'Кара-Буринский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.8, 4.1, 3.9, 4.0, 3.8, 70] },
  { id: 23, name: 'Манасский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.8, 4.1, 3.9, 4.0, 3.8, 4.1, 72] },

  // Ошская область
  { id: 24, name: 'Алайский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.8, 4.0, 3.9, 4.1, 3.8, 76] },
  { id: 25, name: 'Араванский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 4.1, 3.8, 4.0, 3.9, 4.1, 79] },
  { id: 26, name: 'Кара-Кулджинский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.9, 4.1, 3.8, 4.0, 3.9, 71] },
  { id: 27, name: 'Кара-Сууский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.8, 4.0, 3.9, 4.1, 3.8, 4.0, 84] },
  { id: 28, name: 'Ноокатский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.8, 4.0, 3.9, 4.1, 3.8, 77] },
  { id: 29, name: 'Узгенский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 4.1, 3.8, 4.0, 3.9, 4.1, 82] },
  { id: 30, name: 'Чон-Алайский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.9, 4.1, 3.8, 4.0, 3.9, 69] },

  // Баткенская область
  { id: 31, name: 'Баткенский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.8, 4.0, 3.9, 4.1, 3.8, 75] },
  { id: 32, name: 'Кадамжайский районный суд', instance: '1-я инстанция (местный)',
    ratings: [3.9, 4.1, 3.8, 4.0, 3.9, 4.1, 73] },
  { id: 33, name: 'Лейлекский районный суд', instance: '1-я инстанция (местный)',
    ratings: [4.0, 3.9, 4.1, 3.8, 4.0, 3.9, 70] },

  // Города республиканского значения
  { id: 34, name: 'Ленинский районный суд г. Бишкек', instance: '1-я инстанция (местный)',
    ratings: [4.2, 4.0, 4.1, 4.3, 4.2, 4.4, 120] },
  { id: 35, name: 'Октябрьский районный суд г. Бишкек', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 110] },
  { id: 36, name: 'Первомайский районный суд г. Бишкек', instance: '1-я инстанция (местный)',
    ratings: [4.2, 4.0, 4.1, 4.3, 4.2, 4.4, 115] },
  { id: 37, name: 'Свердловский районный суд г. Бишкек', instance: '1-я инстанция (местный)',
    ratings: [4.1, 3.9, 4.0, 4.2, 4.1, 4.3, 105] }
];

const rayonToCourtMapping: { [key: string]: string } = {
  // Баткенская область
  'Batken': 'Баткенский районный суд',
  'Kadamjay': 'Кадамжайский районный суд',
  'Leylek': 'Лейлекский районный суд',
  
  // Чуйская область
  'Alamudun': 'Аламудунский районный суд',
  'Sokuluk': 'Сокулукский районный суд',
  'Moscow': 'Московский районный суд',
  'Jayyl': 'Жайылский районный суд',
  'Panfilov': 'Панфиловский районный суд',
  'Kemin': 'Кеминский районный суд',
  'Ysyk-Ata': 'Ысык-Атинский районный суд',
  'Chuy': 'Чуйский районный суд',
  
  // Иссык-Кульская область
  'Ak-Suu': 'Ак-Суйский районный суд',
  'Jeti-Oguz': 'Джети-Огузский районный суд',
  'Ton': 'Тонский районный суд',
  'Tup': 'Тюпский районный суд',
  'Ysyk-Kol': 'Иссык-Кульский районный суд',
  
  // Нарынская область
  'Ak-Talaa': 'Ак-Талинский районный суд',
  'At-Bashy': 'Ат-Башинский районный суд',
  'Jumgal': 'Жумгальский районный суд',
  'Kochkor': 'Кочкорский районный суд',
  'Naryn': 'Нарынский районный суд',
  
  // Таласская область
  'Talas': 'Таласский районный суд',
  'Bakay-Ata': 'Бакай-Атинский районный суд',
  'Kara-Buura': 'Кара-Буринский районный суд',
  'Manas': 'Манасский районный суд',
  
  // Ошская область
  'Alay': 'Алайский районный суд',
  'Aravan': 'Араванский районный суд',
  'Kara-Kulja': 'Кара-Кулджинский районный суд',
  'Kara-Suu': 'Кара-Сууский районный суд',
  'Nookat': 'Ноокатский районный суд',
  'Uzgen': 'Узгенский районный суд',
  'Chon-Alay': 'Чон-Алайский районный суд'
};

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

          const rating = getRayonRating(d.properties.NAME_2);
          
          tooltip
            .style('display', 'block')
            .style('left', `${tooltipX}px`)
            .style('top', `${tooltipY}px`)
            .html(`
              <div class="font-medium">${d.properties.NAME_2}</div>
              <div class="text-sm text-gray-600">Общая оценка: ${rating.toFixed(1)}</div>
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

  const getRayonRating = (rayonName: string): number => {
    const courtName = rayonToCourtMapping[rayonName];
    const court = courts.find(c => c.name === courtName);
    return court ? court.ratings[0] : 0;
  };

  const getColor = (properties: any): string => {
    if (properties.NAME_2 === 'Ysyk-Köl(lake)' || 
        properties.NAME_2 === 'Ysyk-Kol' || 
        properties.NAME_2 === 'Issyk-Kul') {
      return '#4FA1E3';  // Синий для озера
    }
    
    const rating = getRayonRating(properties.NAME_2);
    
    if (rating >= 4.5) return '#00FFFF';      // Темно-зеленый
    if (rating >= 4.0) return '#4ade80';      // Зеленый
    if (rating >= 3.5) return '#FFFF00';      // Светло-зеленый
    if (rating >= 3.0) return '#bbf7d0';      // Очень светло-зеленый
    return '#FF7074';                         // Почти белый
  };

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