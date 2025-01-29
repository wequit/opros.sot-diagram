'use client';
import React from 'react';
import geoData from '../../gadm41_KGZ_1.json';
import type { FeatureCollection, Feature, Geometry, MultiPolygon, GeoJsonProperties } from 'geojson';
import * as d3 from 'd3';

interface GeoFeature extends Feature<MultiPolygon, GeoJsonProperties> {
  geometry: MultiPolygon;
  properties: {
    NAME_1: string;
  } & GeoJsonProperties;
}

// Координаты для точек и названий областей
const cityLabels = [
  { name: 'БИШКЕК', coordinates: [74.00, 42.63] as [number, number], isCapital: true },
  { name: 'ЧУЙ', coordinates: [74.50, 42.85] as [number, number], isCapital: false },
  { name: 'ЫСЫК-КӨЛ', coordinates: [77.28, 42.20] as [number, number], isCapital: false },
  { name: 'НАРЫН', coordinates: [75.80, 41.50] as [number, number], isCapital: false },
  { name: 'ТАЛАС', coordinates: [72.04, 42.42] as [number, number], isCapital: false },
  { name: 'ЖАЛАЛ-АБАД', coordinates: [73.00, 41.50] as [number, number], isCapital: false },
  { name: 'ОШ', coordinates: [73.59, 40.51] as [number, number], isCapital: true },
  { name: 'БАТКЕН', coordinates: [70.00, 39.90] as [number, number], isCapital: false },
];

export default function Map() {
  // Функция для преобразования GeoJSON координат в SVG path
  const createSVGPath = (feature: GeoFeature): string => {
    const projection = (coord: number[]): [number, number] => {
      // Простая проекция для Кыргызстана
      const x = (coord[0] - 69) * 100; // Примерная долгота
      const y = (43 - coord[1]) * 100; // Примерная широта
      return [x, y];
    };

    return feature.geometry.coordinates.map((polygon: number[][][]) => {
      const points = polygon[0].map((coord: number[]) => {
        const [x, y] = projection(coord);
        return `${x},${y}`;
      }).join(' L ');
      return `M ${points} Z`;
    }).join(' ');
  };

  // Вычисляем границы для viewBox
  const getBounds = (): string => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    (geoData as FeatureCollection<MultiPolygon>).features.forEach((feature: Feature<MultiPolygon, GeoJsonProperties>) => {
      feature.geometry.coordinates.forEach((polygon: number[][][]) => {
        polygon[0].forEach((coord: number[]) => {
          const [x, y] = [(coord[0] - 69) * 100, (43 - coord[1]) * 100];
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        });
      });
    });

    return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
  };

  // Получаем рейтинг для области
  const getOblastRating = (oblastName: string): number => {
    const ratings: { [key: string]: number } = {
      'БИШКЕК': 5.0,
      'ЫСЫК-КӨЛ': 4.3,
      'НАРЫН': 4.3,
      'ТАЛАС': 1.5,
      'ЖАЛАЛ-АБАД': 4.1,
      'ОШ': 4.2,
      'БАТКЕН': 3.3,
      'ЧУЙ': 4.3
    };
    return ratings[oblastName] || 0;
  };

  // Получаем цвет в зависимости от рейтинга
  const getColor = (rating: number): string => {
    // Используем еще более темные и насыщенные оттенки бирюзового
    if (rating >= 5.0) return '#008B8B'; // Бишкек - темный циан
    if (rating >= 4.3) return '#009999'; // Иссык-Куль, Нарын, Чуй
    if (rating >= 4.2) return '#00A3A3'; // Ош
    if (rating >= 4.0) return '#00ADAD'; // Джалал-Абад
    if (rating >= 1) return '#00B8B8'; // Талас
    return '#00C1C1'; // Баткен
  };

  // Функция для проекции координат
  const projection = (coord: [number, number]): [number, number] => {
    const x = (coord[0] - 69) * 100;
    const y = (43 - coord[1]) * 100;
    return [x, y];
  };

  // Добавляем точку для Бишкека
  const bishkekCoords = projection([74.00, 42.63]); // Новые координаты
  
  if (bishkekCoords) {
    // Добавляем группу для точки и текста Бишкека
    const bishkekGroup = d3.select('svg').append('g') // Исправлено: добавлено d3.select для svg
      .attr('class', 'bishkek-marker')
      .style('cursor', 'pointer');

    // Добавляем точку
    bishkekGroup.append('circle')
      .attr('cx', bishkekCoords[0])
      .attr('cy', bishkekCoords[1])
      .attr('r', 4)
      .attr('fill', '#fff')
      .attr('stroke', '#CBD5E1')
      .attr('stroke-width', 1);

    // Добавляем текст
    bishkekGroup.append('text')
      .attr('x', bishkekCoords[0] + 5)
      .attr('y', bishkekCoords[1])
      .text('БИШКЕК')
      .attr('fill', '#000')
      .attr('font-size', '12px')
      .attr('alignment-baseline', 'middle');

    // Добавляем обработчики событий для точки Бишкека
    bishkekGroup
      .on('mouseover', function(event: MouseEvent) {
        d3.select(this as Element).select('circle')
          .attr('fill-opacity', 0.7);

        const tooltip = d3.select('#tooltip');
        tooltip
          .style('display', 'block')
          .style('left', `${event.clientX + 10}px`)
          .style('top', `${event.clientY - 10}px`)
          .html(`
            <div class="font-medium">Бишкек</div>
            <div class="text-sm text-gray-600">Рейтинг: 0</div>
          `);
      })
      .on('mouseout', function(this: SVGGElement) {
        d3.select(this).select('circle')
          .attr('fill-opacity', 1);

        const tooltip = d3.select('#tooltip');
        tooltip.style('display', 'none');
      });
  }

  return (
    <div className="w-full p-4">
      <svg
        viewBox={getBounds()}
        style={{
          width: '100%',
          height: '400px',
          backgroundColor: 'white',
        }}
        preserveAspectRatio="xMidYMid meet"
        className="transition-all duration-300"
      >
        {/* Отрисовка областей */}
        {(geoData as FeatureCollection<MultiPolygon>).features.map((feature: Feature<MultiPolygon, GeoJsonProperties>, index: number) => {
          const rating = getOblastRating(feature.properties?.NAME_1 || '');
          return (
            <g key={index}>
              <path
                d={createSVGPath(feature as Feature<MultiPolygon, { NAME_1: string }>)}
                fill={getColor(rating)}
                stroke="white" 
                strokeWidth="0.5"
                className="transition-colors duration-300 hover:brightness-95"
              />
              <title>{`${feature.properties?.NAME_1}: ${rating}`}</title>
            </g>
          );
        })}

        {/* Отрисовка точек и названий */}
        {cityLabels.map((city, index) => {
          const [x, y] = projection(city.coordinates);
          return (
            <g key={index}>
              {/* Точка для всех городов */}
              <circle
                cx={x}
                cy={y}
                r={city.isCapital ? "4" : "3"}
                fill="white"
                stroke="white"
                strokeWidth="1"
              />
              {/* Название */}
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="700"
                className="select-none"
              >
                {city.name}
              </text>
              {/* Рейтинг */}
              <text
                x={x}
                y={y + 20}
                textAnchor="middle"
                fill="black"
                fontSize="14"
                fontWeight="700"
                className="select-none"
              >
                {getOblastRating(city.name)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}