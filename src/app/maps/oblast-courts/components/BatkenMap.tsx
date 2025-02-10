'use client';
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { MapProps } from '../types';

export default function BatkenMap({ selectedCourt, courtData, onSelectCourt }: MapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // SVG path для Баткенской области
    const batkenPath = "M10,50 L90,50 L90,90 L10,90 Z"; // Это пример пути, замените на реальный

    svg.append("path")
      .attr("d", batkenPath)
      .attr("class", "region-path")
      .style("fill", "#FF6B6B")
      .style("stroke", "#000")
      .style("stroke-width", "1")
      .on("mouseover", function() {
        d3.select(this)
          .style("fill", "#FF8787");
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("fill", "#FF6B6B");
      });

  }, [selectedCourt, courtData]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative w-full h-[400px] bg-white rounded-lg shadow-lg">
        <svg ref={svgRef} className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        </svg>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">№</th>
              <th className="px-4 py-2 text-left">Наименование суда</th>
              <th className="px-4 py-2 text-left">Общая оценка</th>
              <th className="px-4 py-2 text-left">Судья</th>
              <th className="px-4 py-2 text-left">Процесс</th>
              <th className="px-4 py-2 text-left">Сотрудники</th>
              <th className="px-4 py-2 text-left">Канцелярия</th>
              <th className="px-4 py-2 text-left">Доступность</th>
              <th className="px-4 py-2 text-left">Кол-во оценок</th>
            </tr>
          </thead>
          <tbody>
            {courtData.map((court, index) => (
              <tr 
                key={court.id} 
                className={`hover:bg-gray-50 ${selectedCourt === court.name ? 'bg-blue-50' : ''}`}
                onClick={() => onSelectCourt(court.name)}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 text-blue-600 cursor-pointer">{court.name}</td>
                <td className="px-4 py-2">{court.overall_assessment}</td>
                <td className="px-4 py-2">{court.judge_rating}</td>
                <td className="px-4 py-2">{court.process_rating}</td>
                <td className="px-4 py-2">{court.staff_rating}</td>
                <td className="px-4 py-2">{court.office_rating}</td>
                <td className="px-4 py-2">{court.accessibility_rating}</td>
                <td className="px-4 py-2">{court.total_responses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
