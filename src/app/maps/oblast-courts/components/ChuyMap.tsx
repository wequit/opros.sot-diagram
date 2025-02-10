'use client';
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function ChuyMap() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const fetchGeoData = async () => {
      try {
        const response = await fetch('/gadm41_KGZ_1.json');
        const geoData = await response.json();
        
        // В JSON файле ищем Чуйскую область (Chui)
        const chuyRegion = geoData.features.find(
          (feature: any) => 
            feature.properties.NAME_1 === "Chüy" || 
            feature.properties.NAME_1 === "Chüy" ||
            feature.properties.NAME_1 === "Chüy"
        );

        if (!chuyRegion) {
          console.error("Чуйская область не найдена в GeoJSON");
          return;
        }

        // Создаем отдельный FeatureCollection только для Чуйской области
        const chuyFeatureCollection = {
          type: "FeatureCollection",
          features: [chuyRegion]
        };

        // Настраиваем проекцию специально для Чуйской области
        const projection = d3.geoMercator()
          .fitSize([450, 350], chuyFeatureCollection);

        const path = d3.geoPath().projection(projection);

        // Создаем группу для карты
        const g = svg.append("g");

        // Рисуем Чуйскую область
        g.selectAll("path")
          .data([chuyRegion])
          .enter()
          .append("path")
          .attr("d", path as any)
          .style("fill", "#4CAF50")
          .style("stroke", "#fff")
          .style("stroke-width", "1.5")
          .style("cursor", "pointer")
          .on("mouseover", function() {
            d3.select(this)
              .style("fill", "#66BB6A")
              .style("stroke-width", "2");
          })
          .on("mouseout", function() {
            d3.select(this)
              .style("fill", "#4CAF50")
              .style("stroke-width", "1.5");
          });


      } catch (error) {
        console.error("Ошибка загрузки GeoJSON:", error);
      }
    };

    fetchGeoData();
  }, []);

  return (
    <div className="relative w-full h-[400px] bg-white rounded-lg shadow-lg p-4">
      <svg 
        ref={svgRef} 
        className="w-full h-full" 
        viewBox="0 0 400 400" 
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}
