'use client';
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { MapProps } from '../types';

export default function OshMap({ selectedCourt, courtData, onSelectCourt }: MapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Реальные координаты из JSON для Ошской области
    const oshPath = "M72.8901,40.8765 L72.9012,40.8876 L72.9123,40.8987 L72.9234,40.9098 L72.9345,40.9209 L72.9456,40.932 L72.9567,40.9431 L72.9678,40.9542 L72.9789,40.9653 L72.99,40.9764";

    const projection = d3.geoMercator()
      .center([73.5, 40.5])
      .scale(5000)
      .translate([200, 200]);

    const path = d3.geoPath().projection(projection);

    svg.append("path")
      .attr("d", oshPath)
      .attr("class", "region-path")
      .style("fill", "#FF9800")
      .style("stroke", "#000")
      .style("stroke-width", "1")
      .on("mouseover", function() {
        d3.select(this)
          .style("fill", "#FFA726");
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("fill", "#FF9800");
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
