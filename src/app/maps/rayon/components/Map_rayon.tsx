'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import rayonData from '../../../../../public/gadm41_KGZ_2.json';
import  courts  from '../District-Courts/page'; // Импортируем данные из page.tsx

// Обновленный маппинг районов к судам
const rayonToCourtMapping: { [key: string]: string } = {
  // Бишкек
  'Biskek': 'Бишкекский межрайонный суд',
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

interface Court {
  id: number;
  name: string;
  instance: string;
  overall_assessment: number;
  assessment: {
    judge: number;
    process: number;
    staff: number;
    office: number;
    building: number;
  };
  total_survey_responses: number;
}

interface MapProps {
  selectedRayon: string | null;
  onSelectRayon?: (courtName: string) => void;
  courts: Court[]; // Добавляем courts в пропсы
}

// Обновляем координаты для судов, добавляя недостающий суд
const courtCoordinates: { [key: string]: [number, number] } = {
  // Сохраняем все существующие суды с их координатами
  'Административный суд Баткенской области': [69.8597, 40.0563],
  'Административный суд Джалал-Абадской области': [72.9814, 41.0373],
  'Административный суд Иссык-Кульской области': [76.7826, 42.1387],
  'Административный суд Нарынской области': [75.9911, 41.5369],
  'Административный суд Ошской области': [72.8085, 40.6240],
  'Административный суд Таласской области': [72.2427, 42.5380],
  'Административный суд Чуйской области': [74.5698, 42.9800],
  'Административный суд города Бишкек': [74.5698, 42.8700],
  
  'Ленинский районный суд города Бишкек': [74.5005, 42.7850],
  'Октябрьский районный суд города Бишкек': [74.408, 42.8950],
  'Первомайский районный суд города Бишкек': [74.7428, 42.8906],
  'Свердловский районный суд города Бишкек': [74.685, 42.800],
  
  'Балыкчинский городской суд': [76.1055, 42.4560],
  'Джалал-Абадский городской суд': [72.9814, 40.9173],
  'Каракольский городской суд': [78.4147, 42.507],
  'Нарынский городской суд': [75.9911, 41.4169],
  'Ошский городской суд': [72.7985, 40.5040],
  'Таласский городской суд': [72.2827, 42.4400],
  'Токмокский городской суд': [75.3015, 42.7821],
  

  // Добавляем только новые городские суды
  'Кызыл-Кийский городской суд': [72.1077, 40.2566],
  'Майлуу-Сууйский городской суд': [72.4447, 41.1547],
  'Ташкумырский городской суд': [72.2166, 41.3419],
  'Узгенский городской суд': [73.3046, 40.7697],
  'Кара-Кульский городской суд': [73.1502, 41.6502],
  'Сулюктинский городской суд': [69.5772, 39.9405]
};

// Функция определения цвета на основе оценки
const getColorByRating = (rating: number): string => {
  if (rating === 0) return '#999999';
  if (rating >= 4.5) return '#66C266';
  if (rating >= 4.0) return '#B4D330';
  if (rating >= 3.5) return '#FFC04D';
  if (rating >= 3.0) return '#F4A460';
  if (rating >= 2.5) return '#E57357';
  if (rating >= 2.0) return '#CD5C5C';
  if (rating >= 1.5) return '#A52A2A';
  return '#8B0000';
};

export default function Map_rayon({ selectedRayon, onSelectRayon, courts }: MapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Обновляем функцию getRayonRating
  const getRayonRating = (rayonName: string): number => {
    if (!courts || !Array.isArray(courts)) {
      console.log('Courts data is not available');
      return 0;
    }

    const courtName = rayonToCourtMapping[rayonName];
    if (!courtName) {
      console.log(`Нет маппинга для района: ${rayonName}`);
      return 0;
    }

    const court = courts.find((c: Court) => c.name === courtName);
    return court ? court.overall_assessment : 0;
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !Array.isArray(courts)) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1200;
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

    const getColor = (rating: number, isSelected: boolean, properties: any): string => {
      // Сначала проверяем озера
      if (properties.NAME_2 === 'Ysyk-Köl(lake)' || 
          properties.NAME_2 === 'Ysyk-Kol' || 
          properties.NAME_2 === 'Issyk-Kul' ||
          properties.NAME_2 === 'Song-Kol' || 
          properties.NAME_2 === 'Song-Kol(lake)' || 
          properties.NAME_2 === 'Song-kol') {
        return '#7CC9F0';
      }

      // Затем обычная логика цветов
      if (!isSelected && selectedRayon) return '#E5E7EB';
      if (rating === 0) return '#999999';
      if (rating >= 4.5) return '#66C266';
      if (rating >= 4.0) return '#B4D330';
      if (rating >= 3.5) return '#FFC04D';
      if (rating >= 3.0) return '#F4A460';
      if (rating >= 2.5) return '#E57357';
      if (rating >= 2.0) return '#CD5C5C';
      if (rating >= 1.5) return '#A52A2A';
      if (rating >= 1.0) return '#8B0000';
      return '#999999';
    };

    
    // Обновляем отрисовку районов
    g.selectAll('path')
      .data((rayonData as any).features)
      .join('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const rating = getRayonRating(d.properties.NAME_2);
        const isSelected = selectedRayon === null || rayonToCourtMapping[d.properties.NAME_2] === selectedRayon;
        return getColor(rating, isSelected, d.properties);
      })
      .attr('stroke', 'white')
      .attr('stroke-width', '0.5')
      .style('cursor', 'pointer')
      .on('mouseover', function(event: any, d: any) {
        if (isLake(d.properties)) return;
        
        d3.select(this).attr('fill-opacity', 0.7);
        const coordinates = getEventCoordinates(event);
        
        tooltip
          .style('display', 'block')
          .style('position', 'fixed')
          .style('left', `${coordinates.x + 10}px`)
          .style('top', `${coordinates.y + 10}px`)
          .html(() => {
            const rating = getRayonRating(d.properties.NAME_2);
            return `
              <div class="font-medium">${d.properties.NAME_2}</div>
              <div class="text-sm text-gray-600">Общая оценка: ${rating ? rating.toFixed(1) : 'Нет данных'}</div>
            `;
          });
      })
      .on('mousemove', function(event: any) {
        const coordinates = getEventCoordinates(event);
        tooltip
          .style('left', `${coordinates.x + 10}px`)
          .style('top', `${coordinates.y + 10}px`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('fill-opacity', 1);
        tooltip.style('display', 'none');
      })
      .on('touchstart', function(event: any, d: any) {
        event.preventDefault(); // Предотвращаем стандартное поведение
        if (isLake(d.properties)) return;
        
        d3.select(this).attr('fill-opacity', 0.7);
        const coordinates = getEventCoordinates(event);
        
        tooltip
          .style('display', 'block')
          .style('position', 'fixed')
          .style('left', `${coordinates.x + 10}px`)
          .style('top', `${coordinates.y + 10}px`)
          .html(() => {
            const rating = getRayonRating(d.properties.NAME_2);
            return `
              <div class="font-medium">${d.properties.NAME_2}</div>
              <div class="text-sm text-gray-600">Общая оценка: ${rating ? rating.toFixed(1) : 'Нет данных'}</div>
            `;
          });
      });

    // Добавляем текст оценок поверх карты
    const textGroup = g.append('g')
      .attr('class', 'rating-labels');

    textGroup.selectAll('text')
      .data((rayonData as any).features)
      .join('text')
      .attr('x', (d: any) => path.centroid(d)[0])
      .attr('y', (d: any) => path.centroid(d)[1])
      .attr('text-anchor', 'middle')
      .style('pointer-events', 'none') // Отключаем события мыши для текста
      .attr('font-weight', 'bold')
      .attr('font-size', '10px')
      .text((d: any) => {
        if (d.properties.NAME_2 === 'Ysyk-Köl(lake)' || 
            d.properties.NAME_2 === 'Ysyk-Kol' || 
            d.properties.NAME_2 === 'Issyk-Kul' ||
            d.properties.NAME_2 === 'Song-Kol' || 
            d.properties.NAME_2 === 'Song-Kol(lake)' || 
            d.properties.NAME_2 === 'Song-kol') {
          return '';
        }
        const rating = getRayonRating(d.properties.NAME_2);
        return rating ? rating.toFixed(1) : '';
      });


    // Добавляем точки для судов
    g.selectAll('circle')
      .data(Object.entries(courtCoordinates))
      .join('circle')
      .attr('cx', d => {
        const [x, y] = projection(d[1]) || [0, 0];
        return x;
      })
      .attr('cy', d => {
        const [x, y] = projection(d[1]) || [0, 0];
        return y;
      })
      .attr('r', 4) // Уменьшенный размер точек
      .attr('fill', d => {
        const court = courts.find(c => c.name === d[0]);
        return getColorByRating(court ? court.overall_assessment : 0);
      })
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('opacity', 1)
          .attr('r', 6); // Увеличенный размер при наведении
        
        const court = courts.find(c => c.name === d[0]);
        tooltip
          .style('display', 'block')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`)
          .html(`
            <div class="font-medium">${d[0]}</div>
            <div class="text-sm text-gray-600">Общая оценка: ${court ? court.overall_assessment.toFixed(1) : 'Нет данных'}</div>
          `);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 0.8)
          .attr('r', 4); // Возврат к исходному размеру
        
        tooltip.style('display', 'none');
      });

  }, [selectedRayon, onSelectRayon, courts]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef} className="absolute hidden bg-white p-2 rounded shadow-lg"></div>
    </div>
  );
}

function isLake(properties: any): boolean {
  return properties.NAME_2 === 'Ysyk-Köl(lake)' || 
         properties.NAME_2 === 'Ysyk-Kol' || 
         properties.NAME_2 === 'Issyk-Kul' ||
         properties.NAME_2 === 'Song-Kol' || 
         properties.NAME_2 === 'Song-Kol(lake)' || 
         properties.NAME_2 === 'Song-kol';
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