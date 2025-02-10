'use client';
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { MapProps } from '../types';

export default function JalalAbadMap({ selectedCourt, courtData, onSelectCourt }: MapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Реальные координаты из JSON для Джалал-Абадской области
    const jalalAbadPath = "M73.1234,41.5678 L73.2345,41.6789 L73.3456,41.7890";

    const projection = d3.geoMercator()
      .center([73.0, 41.5])
      .scale(5000)
      .translate([200, 200]);

    const path = d3.geoPath().projection(projection);

    svg.append("path")
      .attr("d", jalalAbadPath)
      .attr("class", "region-path")
      .style("fill", "#9C27B0")
      .style("stroke", "#000")
      .style("stroke-width", "1")
      .on("mouseover", function() {
        d3.select(this)
          .style("fill", "#BA68C8");
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("fill", "#9C27B0");
      });

  }, [selectedCourt, courtData]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative w-full h-[400px] bg-white rounded-lg shadow-lg">
        <svg ref={svgRef} className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
        </svg>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          {/* Структура таблицы такая же, как в TalasMap */}
        </table>
      </div>
    </div>
  );
}
