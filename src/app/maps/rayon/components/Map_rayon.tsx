'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import rayonData from '@/app/maps/gadm41_KGZ_2.json';
import { courts } from '../page'; // Импортируем данные из page.tsx

// Обновленный маппинг районов к судам
const rayonToCourtMapping: { [key: string]: string } = {
  // Бишкек
  'Biškek': 'Бишкекский межрайонный суд',
  // Баткенская область
  'Batken': 'Баткенский районный суд',
  'Lailak': 'Лейлекский районный суд',
  'Kadamjai': 'Кадамжайский районный суд',

  // Чуйская область
  'Alamüdün': 'Аламудунский районный суд',
  'Sokuluk': 'Сокулукский районный суд',
  'Moskovsky': 'Московский районный суд',
  'Jaiyl': 'Жайылский районный суд',
  'Panfilov': 'Панфиловский районный суд',
  'Kemin': 'Кеминский районный суд',
  'Ysyk-Ata': 'Ысык-Атинский районный суд',
  'Chui': 'Чуйский районный суд',

  // Иссык-Кульская область
  'Ak-Suu': 'Ак-Суйский районный суд',
  'Djety-Oguz': 'Джети-Огузский районный суд',
  'Ton': 'Тонский районный суд',
  'Tüp': 'Тюпский районный суд',
  'Ysyk-Köl': 'Иссык-Кульский районный суд',

  // Нарынская область
  'Ak-Talaa': 'Ак-Талинский районный суд',
  'At-Bashi': 'Ат-Башинский районный суд',
  'Jumgal': 'Жумгальский районный суд',
  'Kochkor': 'Кочкорский районный суд',
  'Naryn': 'Нарынский районный суд',

  // Таласская область
  'Talas': 'Таласский районный суд',
  'Bakai-Ata': 'Бакай-Атинский районный суд',
  'Kara-Buura': 'Кара-Буринский районный суд',
  'Manas': 'Манасский районный суд',

  // Ошская область
  'Alai': 'Алайский районный суд',
  'Aravan': 'Араванский районный суд',
  'Kara-Kuldja': 'Кара-Кулджинский районный суд',
  'Kara-Suu': 'Кара-Сууский районный суд',
  'Nookat': 'Ноокатский районный суд',
  'Uzgen': 'Узгенский районный суд',
  'Chong-Alay': 'Чон-Алайский районный суд',

  // Джалал-Абадская область
  'Aksyi': 'Аксыйский районный суд',
  'Ala-Buka': 'Ала-Букинский районный суд',
  'Bazar-Korgon': 'Базар-Коргонский районный суд',
  'Chatkal': 'Чаткальский районный суд',
  'Nooken': 'Ноокенский районный суд',
  'Suzak': 'Сузакский районный суд',
  'Togus-Toro': 'Тогуз-Тороуский районный суд',
  'Toktogul': 'Токтогульский районный суд'
};



// В функции getRayonRating добавим проверку на существование маппинга
const getRayonRating = (rayonName: string): number => {
  const courtName = rayonToCourtMapping[rayonName];
  if (!courtName) {
    console.log(`Нет маппинга для района: ${rayonName}`);
    return 0;
  }
  const court = courts.find(c => c.name === courtName);
  return court ? court.ratings[0] : 0;
};

interface MapProps {
  selectedRayon: string | null;
}

export default function Map_rayon({ selectedRayon }: MapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    
    svg.attr('width', width)
       .attr('height', height)
       .attr('viewBox', `0 0 ${width} ${height}`)
       .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g');

    // Создаем функцию зума с ограничениями
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [width, height]]) // Ограничиваем область перемещения
      .extent([[0, 0], [width, height]])
      .on('zoom', (event) => {
        // Получаем текущую трансформацию
        const transform = event.transform;
        
        // Ограничиваем перемещение в зависимости от масштаба
        const scale = transform.k;
        const tx = Math.min(0, Math.max(transform.x, width * (1 - scale)));
        const ty = Math.min(0, Math.max(transform.y, height * (1 - scale)));
        
        // Применяем ограниченную трансформацию
        g.attr('transform', `translate(${tx},${ty}) scale(${scale})`);
      });

    // Применяем зум к SVG
    svg.call(zoom as any);

    const projection = d3.geoMercator()
      .center([74.5, 41.5])
      .scale(3200)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const tooltip = d3.select(tooltipRef.current);

    const getColor = (properties: any): string => {
      if (properties.NAME_2 === 'Ysyk-Köl(lake)' || 
          properties.NAME_2 === 'Ysyk-Kol' || 
          properties.NAME_2 === 'Issyk-Kul') {
        return '#7CC9F0';
      } 

      if (properties.NAME_2 === 'Song-Kol' || 
        properties.NAME_2 === 'Song-Kol(lake)' || 
        properties.NAME_2 === 'Song-kol') {
       return '#7CC9F0';
    }
      
      const rating = getRayonRating(properties.NAME_2);
      
      if (rating >= 4.5) return '#8fce00';     
      if (rating >= 4.0) return '#38761d';     
      if (rating >= 3.5) return '#ffe599';     
      if (rating >= 3.0) return '#bf9000';     
      if (rating === 0) return '#999999';      
      return '#FF7074';                        
    };

    // Перемещаем отрисовку в группу g
    g.selectAll('path')
      .data((rayonData as any).features)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => getColor(d.properties))
      .attr('stroke', 'white')
      .attr('stroke-width', '0.5')
      .on('mouseover', function(event, d: any) {
        // Пропускаем тултип для озера
        if (d.properties.NAME_2 === 'Ysyk-Köl(lake)' || 
            d.properties.NAME_2 === 'Ysyk-Kol' || 
            d.properties.NAME_2 === 'Issyk-Kul') {
          return;
        }
        if (d.properties.NAME_2 === 'Song-Kol' || 
          d.properties.NAME_2 === 'Song-Kol(lake)' || 
          d.properties.NAME_2 === 'Song-kol') {
        return;
      }

        d3.select(this)
          .attr('fill-opacity', 0.7);

        const [mouseX, mouseY] = d3.pointer(event);
        const containerRect = containerRef.current?.getBoundingClientRect();
        const tooltipNode = tooltipRef.current;

        if (containerRect && tooltipNode) {
          let tooltipX = mouseX;
          let tooltipY = mouseY;

          tooltip
            .style('display', 'block')
            .style('left', `${tooltipX + 10}px`)
            .style('top', `${tooltipY + 10}px`)
            .html(() => {
              const rating = getRayonRating(d.properties.NAME_2);
              return `
                <div class="font-medium">${d.properties.NAME_2}</div>
                <div class="text-sm text-gray-600">Общая оценка: ${rating ? rating.toFixed(1) : 'Нет данных'}</div>
              `;
            });
        }
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('fill-opacity', 1);
        tooltip.style('display', 'none');
      });

    // Перемещаем легенду и метки в группу g
    const legend = g.append('g')
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

    // Создаем элементы легенды
    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    // Добавляем цветные прямоугольники
    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => d.color);

    // Добавляем текст
    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .text(d => d.label)
      .attr('class', 'text-sm fill-gray-700');

    // Добавляем оценки на карту
    g.selectAll('.rating-label')
      .data((rayonData as any).features)
      .enter()
      .append('text')
      .attr('class', 'rating-label')
      .attr('transform', function(d: any) {
        const centroid = path.centroid(d);
        return `translate(${centroid[0]},${centroid[1]})`;
      })
      .text((d: any) => {
        if (d.properties.NAME_2 === 'Ysyk-Köl(lake)' || 
            d.properties.NAME_2 === 'Ysyk-Kol' || 
            d.properties.NAME_2 === 'Issyk-Kul') {
          return '';
        }
        const rating = getRayonRating(d.properties.NAME_2);
        return rating ? rating.toFixed(1) : '';
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', 'black')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('stroke', 'white')
      .attr('stroke-width', '0.5px');

  }, [selectedRayon]);

  return (
    <div ref={containerRef} className="relative w-full flex justify-center items-center overflow-hidden">
      <div className="w-full max-w-[1200px]">
        <svg 
          ref={svgRef} 
          className="w-full h-auto"
          style={{ cursor: 'grab' }}
        ></svg>
        <div
          ref={tooltipRef}
          className="absolute hidden bg-white px-2 py-1 rounded-md shadow-lg border border-gray-200 z-10"
          style={{ pointerEvents: 'none' }}
        ></div>
      </div>
    </div>
  );
}