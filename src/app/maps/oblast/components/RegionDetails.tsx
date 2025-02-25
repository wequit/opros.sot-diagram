import { getCookie } from "@/api/login";
import { useSurveyData } from "@/context/SurveyContext";
import React, { useCallback, useState } from "react";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import * as d3 from 'd3';
import { GeoPermissibleObjects } from 'd3-geo';
import geoData from '../../../../../public/gadm41_KGZ_1.json';

const getRatingColor = (rating: number) => {
  if (rating === 0) return '#F3F4F6'; // gray-100
  if (rating <= 2) return '#FEE2E2'; // red-100
  if (rating <= 3.5) return '#FEF3C7'; // yellow-100
  return '#DCFCE7'; // green-100
};

// Обновляем функцию для определения цвета границы точки
const getRatingBorderColor = (rating: number) => {
  if (rating === 0) return '#9CA3AF'; // gray-400
  if (rating <= 2) return '#EF4444'; // red-500
  if (rating <= 3.5) return '#F59E0B'; // yellow-500
  return '#22C55E'; // green-500
};

interface RegionData {
  id: number;
  name: string;
  ratings: number[];
  overall: number;
  totalAssessments: number;
  coordinates?: [number, number];
}

interface GeoFeature {
  type: string;
  properties: {
    GID_1: string;
    GID_0: string;
    COUNTRY: string;
    NAME_1: string;
    VARNAME_1: string;
    NL_NAME_1: string;
    TYPE_1: string;
    ENGTYPE_1: string;
    CC_1: string;
    HASC_1: string;
    ISO_1: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][][] | number[][][];
  };
}

interface GeoJsonData {
  type: string;
  name: string;
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  features: GeoFeature[];
}

// Координаты для всех судов по областям
const courtPositionsMap: { [key: string]: { [key: string]: [number, number] } } = {
  'Баткенская область': {
    'Баткенский областной суд': [69.8785, 40.0553],
    'Сулюктинский городской суд': [69.5672, 39.9373],
    'Кызыл-Кийский городской суд': [72.1279, 40.2573],
    'Лейлекский районный суд': [69.7922, 39.7445],
    'Баткенский районный суд': [70.8199, 40.0553],
    'Кадамжайский районный суд': [71.7499, 40.1343],
    'Административный суд Баткенской области': [70.9499, 40.0553]
  },
  'Жалал-Абадская область': {
    'Жалал-Абадский областной суд': [72.9873, 41.1056],
    'Жалал-Абадский городской суд': [73.0023, 40.9333],
    'Кара-Кульский городской суд': [72.8667, 41.6167],
    'Майлуу-Сууский городской суд': [72.4667, 41.3],
    'Таш-Кумырский городской суд': [72.2167, 41.3467],
    'Базар-Коргонский районный суд': [72.7500, 41.0333],
    'Ноокенский районный суд': [72.6167, 41.1833],
    'Сузакский районный суд': [73.0167, 40.8833],
    'Токтогульский районный суд': [72.9423, 41.8744],
    'Тогуз-Тороуский районный суд': [74.3167, 41.7833],
    'Чаткальский районный суд': [71.8000, 41.7667],
    'Аксыйский районный суд': [71.8667, 41.4333],
    'Ала-Букинский районный суд': [71.4000, 41.4000],
    'Административный суд Жалал-Абадской области': [72.9973, 41.1156]
  },
  'Иссык-Кульская область': {
    'Иссык-Кульский областной суд': [77.0667, 42.6500],
    'Балыкчинский городской суд': [76.1833, 42.4500],
    'Каракольский городской суд': [78.3833, 42.4833],
    'Ак-Суйский районный суд': [78.5333, 42.5000],
    'Жети-Огузский районный суд': [78.0289, 42.0833],
    'Иссык-Кульский районный суд': [77.2067, 42.6167],
    'Тонский районный суд': [77.9167, 42.1333],
    'Тюпский районный суд': [78.3667, 42.7278],
    'Административный суд Иссык-Кульской области': [77.0867, 42.6400]
  },
  'Нарынская область': {
    'Нарынский областной суд': [75.9311, 41.4473],
    'Нарынский городской суд': [76.0033, 41.5433],
    'Ат-Башинский районный суд': [75.8067, 41.1700],
    'Ак-Талинский районный суд': [75.3567, 41.4200],
    'Жумгальский районный суд': [74.8333, 41.9333],
    'Кочкорский районный суд': [75.7833, 42.2167],
    'Административный суд Нарынской области': [76.0711, 41.4373]
  },
  'Ошская область': {
    'Ошский областной суд': [72.8825, 40.4900],
    'Ошский городской суд': [72.8120, 40.5533],
    'Алайский районный суд': [72.9833, 39.6500],
    'Араванский районный суд': [72.5107, 40.5067],
    'Кара-Кулжинский районный суд': [73.5000, 40.2667],
    'Кара-Сууский районный суд': [72.8667, 40.7000],
    'Ноокатский районный суд': [72.6167, 40.2667],
    'Узгенский районный суд': [73.3000, 40.7667],
    'Чон-Алайский районный суд': [72.0000, 39.5000],
    'Административный суд Ошской области': [72.7585, 40.4800]
  },
  'Таласская область': {
    'Таласский областной суд': [72.2425, 42.5550],
    'Таласский городской суд': [72.203, 42.5167],
    'Бакай-Атинский районный суд': [72.1667, 42.3333],
    'Кара-Бууринский районный суд': [71.1300, 42.5000],
    'Манасский районный суд': [72.5000, 42.5333],
    'Административный суд Таласской области': [72.2545, 42.5150]
  },
  'Чуйская область': {
    'Чуйский областной суд': [74.5900, 42.9046],
    'Токмокский городской суд': [75.3000, 42.8333],
    'Аламудунский районный суд': [74.6833, 42.8700],
    'Жайылский районный суд': [73.6167, 42.8667],
    'Кеминский районный суд': [75.7000, 42.7833],
    'Московский районный суд': [73.9333, 42.8833],
    'Панфиловский районный суд': [73.6500, 42.8333],
    'Сокулукский районный суд': [74.0833, 42.8667],
    'Ысык-Атинский районный суд': [74.9833, 42.8833],
    'Административный суд Чуйской области': [74.5000, 42.8646]
  },
  'город Бишкек': {
    'Бишкекский городской суд': [74.5900, 42.8746],
    'Первомайский районный суд': [74.6100, 42.8846],
    'Свердловский районный суд': [74.5700, 42.8646],
    'Ленинский районный суд': [74.5800, 42.8546],
    'Октябрьский районный суд': [74.6000, 42.8746],
    'Административный суд города Бишкек': [74.5950, 42.8796],
    'Межрайонный суд города Бишкек': [74.5850, 42.8696]
  }
};


function RegionDetails({ regionName }: { regionName: string | null }) {
  const {
    selectedRegion,
    setSelectedRegion,
    setSurveyData,
    setIsLoading,
    selectedCourtName,
    setSelectedCourtName,
    selectedCourtId,
    setSelectedCourtId,
  } = useSurveyData();

  const handleCourtClick = async (courtId: number, courtName: string) => {
    setSelectedCourtId(courtId);
    localStorage.setItem("selectedCourtId", courtId.toString());
    localStorage.setItem("selectedCourtName", courtName);
    setSelectedCourtName(courtName);

    try {
      const token = getCookie("access_token");
      if (!token) throw new Error("Token is null");

      const response = await fetch(
        `https://opros.sot.kg/api/v1/results/${courtId}/?year=2025`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Ошибка HTTP: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setSurveyData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка при получении данных суда:", error);
    }
  };

  const renderRegionMap = useCallback(() => {
    if (!regionName || !selectedRegion) return null;

    const courtPositions = courtPositionsMap[regionName] || {};

    const regionMapping: { [key: string]: string } = {
      'Баткенская область': 'Batken',
      'Жалал-Абадская область': 'Jalal-Abad',
      'Иссык-Кульская область': 'Ysyk-Köl',
      'Нарынская область': 'Naryn',
      'Ошская область': 'Osh',
      'Таласская область': 'Talas',
      'Чуйская область': 'Chüy',
      'Город Бишкек': 'Biškek'
    };

    const geoJsonData = geoData as GeoJsonData;
    const regionFeature = geoJsonData.features.find(
      (feature) => feature.properties.NAME_1 === regionMapping[regionName]
    );

    if (!regionFeature) return null;

    return (
      <div className="w-full h-[400px] relative mb-6 bg-white rounded-lg shadow-sm p-4">
        <style>
          {`
            #tooltip {
              pointer-events: none;
              transition: all 0.1s  ease;
              z-index: 1000;
              position: fixed;
            }
          `}
        </style>
        <div
          id="tooltip"
          className="absolute hidden bg-white px-3 py-2 rounded shadow-lg border border-gray-200 z-50"
        />
        <svg ref={(node) => {
          if (node) {
            const width = node.clientWidth;
            const height = node.clientHeight;
            const svg = d3.select(node);
            svg.selectAll("*").remove();

            // Создаем градиент для фона области
            const gradient = svg.append("defs")
              .append("linearGradient")
              .attr("id", "region-gradient")
              .attr("x1", "0%")
              .attr("y1", "0%")
              .attr("x2", "100%")
              .attr("y2", "100%");

            gradient.append("stop")
              .attr("offset", "0%")
              .attr("style", "stop-color: #EBF4FF; stop-opacity: 1");

            gradient.append("stop")
              .attr("offset", "100%")
              .attr("style", "stop-color: #E5E7EB; stop-opacity: 1");

            const margin = { top: 20, right: 20, bottom: 20, left: 20 };
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            const g = svg.append("g")
              .attr("transform", `translate(${margin.left},${margin.top})`);

            const projection = d3.geoMercator()
              .fitSize([innerWidth, innerHeight], regionFeature as unknown as GeoPermissibleObjects);

            const path = d3.geoPath().projection(projection);

            // Рисуем область с градиентом и улучшенными границами
            g.append("path")
              .datum(regionFeature as unknown as GeoPermissibleObjects)
              .attr("d", path)
              .attr("fill", "url(#region-gradient)")
              .attr("stroke", "#4B5563")
              .attr("stroke-width", 1.5)
              .attr("stroke-linejoin", "round")
              .attr("filter", "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))");

            // Добавляем суды как точки на карте
            selectedRegion.forEach((court: RegionData & { coordinates?: [number, number] }) => {
              const position = courtPositions[court.name];
              if (position) {
                const [lon, lat] = position;
                const [x, y] = projection([lon, lat]) || [0, 0];

                const tooltip = d3.select("#tooltip");
                const ratingColor = getRatingColor(court.overall);
                const borderColor = getRatingBorderColor(court.overall);

                g.append("circle")
                  .attr("cx", x)
                  .attr("cy", y)
                  .attr("r", 6)
                  .attr("fill", ratingColor)
                  .attr("stroke", borderColor)
                  .attr("stroke-width", 2)
                  .attr("class", "cursor-pointer transition-all duration-200")
                  .attr("filter", "drop-shadow(0 1px 1px rgb(0 0 0 / 0.1))")
                  .on("mousemove", (event) => {
                    d3.select(event.currentTarget)
                      .transition()
                      .duration(200)
                      .attr("r", 8)
                      .attr("stroke-width", 3);

                    const tooltipNode = tooltip.node() as HTMLElement;
                    
                    tooltip
                      .style("display", "block")
                      .style("left", `${event.clientX + 20}px`)
                      .style("top", `${event.clientY - 10}px`)
                      .html(`
                        <div class="font-medium">${court.name}</div>
                        <div class="text-sm text-gray-600">
                          Общая оценка: <span class="font-medium" style="color: ${borderColor}">${court.overall.toFixed(1)}</span>
                        </div>
                      `);

                    // Проверяем и корректируем позицию, если тултип выходит за пределы экрана
                    const tooltipRect = tooltipNode.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;

                    if (event.clientX + tooltipRect.width + 20 > viewportWidth) {
                      tooltip.style("left", `${event.clientX - tooltipRect.width - 20}px`);
                    }
                    if (event.clientY + tooltipRect.height > viewportHeight) {
                      tooltip.style("top", `${event.clientY - tooltipRect.height - 10}px`);
                    }
                  })
                  .on("mouseout", (event) => {
                    d3.select(event.currentTarget)
                      .transition()
                      .duration(200)
                      .attr("r", 6)
                      .attr("stroke-width", 2);
                    tooltip.style("display", "none");
                  })
                  .on("click", () => {
                    handleCourtClick(court.id, court.name);
                  });
              }
            });
          }
        }} className="w-full h-full" />
      </div>
    );
  }, [regionName, selectedRegion, handleCourtClick]);

  

  const handleCourtBackClick = () => {
    setSelectedCourtId(null);
    setSelectedCourtName(null);
  };

  const handleRegionBackClick = () => {
    setSelectedRegion(null);
  };

  // Добавляем функцию для отрисовки карты области
  const renderRegionMap = useCallback(() => {
    if (!regionName || !selectedRegion) return null;

    const courtPositions = courtPositionsMap[regionName] || {};

    const regionMapping: { [key: string]: string } = {
      'Баткенская область': 'Batken',
      'Жалал-Абадская область': 'Jalal-Abad',
      'Иссык-Кульская область': 'Ysyk-Köl',
      'Нарынская область': 'Naryn',
      'Ошская область': 'Osh',
      'Таласская область': 'Talas',
      'Чуйская область': 'Chüy',
      'Город Бишкек': 'Biškek'
    };

    const geoJsonData = geoData as GeoJsonData;
    const regionFeature = geoJsonData.features.find(
      (feature) => feature.properties.NAME_1 === regionMapping[regionName]
    );

    if (!regionFeature) return null;

    return (
      <div className="w-full h-[400px] relative mb-6 bg-white rounded-lg shadow-sm p-4">
        <style>
          {`
            #tooltip {
              pointer-events: none;
              transition: all 0.1s  ease;
              z-index: 1000;
              position: fixed;
            }
          `}
        </style>
        <div
          id="tooltip"
          className="absolute hidden bg-white px-3 py-2 rounded shadow-lg border border-gray-200 z-50"
        />
        <svg ref={(node) => {
          if (node) {
            const width = node.clientWidth;
            const height = node.clientHeight;
            const svg = d3.select(node);
            svg.selectAll("*").remove();

            // Создаем градиент для фона области
            const gradient = svg.append("defs")
              .append("linearGradient")
              .attr("id", "region-gradient")
              .attr("x1", "0%")
              .attr("y1", "0%")
              .attr("x2", "100%")
              .attr("y2", "100%");

            gradient.append("stop")
              .attr("offset", "0%")
              .attr("style", "stop-color: #EBF4FF; stop-opacity: 1");

            gradient.append("stop")
              .attr("offset", "100%")
              .attr("style", "stop-color: #E5E7EB; stop-opacity: 1");

            const margin = { top: 20, right: 20, bottom: 20, left: 20 };
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            const g = svg.append("g")
              .attr("transform", `translate(${margin.left},${margin.top})`);

            const projection = d3.geoMercator()
              .fitSize([innerWidth, innerHeight], regionFeature as unknown as GeoPermissibleObjects);

            const path = d3.geoPath().projection(projection);

            // Рисуем область с градиентом и улучшенными границами
            g.append("path")
              .datum(regionFeature as unknown as GeoPermissibleObjects)
              .attr("d", path)
              .attr("fill", "url(#region-gradient)")
              .attr("stroke", "#4B5563")
              .attr("stroke-width", 1.5)
              .attr("stroke-linejoin", "round")
              .attr("filter", "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))");

            // Добавляем суды как точки на карте
            selectedRegion.forEach((court: RegionData & { coordinates?: [number, number] }) => {
              const position = courtPositions[court.name];
              if (position) {
                const [lon, lat] = position;
                const [x, y] = projection([lon, lat]) || [0, 0];

                const tooltip = d3.select("#tooltip");
                const ratingColor = getRatingColor(court.overall);
                const borderColor = getRatingBorderColor(court.overall);

                g.append("circle")
                  .attr("cx", x)
                  .attr("cy", y)
                  .attr("r", 6)
                  .attr("fill", ratingColor)
                  .attr("stroke", borderColor)
                  .attr("stroke-width", 2)
                  .attr("class", "cursor-pointer transition-all duration-200")
                  .attr("filter", "drop-shadow(0 1px 1px rgb(0 0 0 / 0.1))")
                  .on("mousemove", (event) => {
                    d3.select(event.currentTarget)
                      .transition()
                      .duration(200)
                      .attr("r", 8)
                      .attr("stroke-width", 3);

                    const tooltipNode = tooltip.node() as HTMLElement;
                    
                    tooltip
                      .style("display", "block")
                      .style("left", `${event.clientX + 20}px`)
                      .style("top", `${event.clientY - 10}px`)
                      .html(`
                        <div class="font-medium">${court.name}</div>
                        <div class="text-sm text-gray-600">
                          Общая оценка: <span class="font-medium" style="color: ${borderColor}">${court.overall.toFixed(1)}</span>
                        </div>
                      `);

                    // Проверяем и корректируем позицию, если тултип выходит за пределы экрана
                    const tooltipRect = tooltipNode.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;

                    if (event.clientX + tooltipRect.width + 20 > viewportWidth) {
                      tooltip.style("left", `${event.clientX - tooltipRect.width - 20}px`);
                    }
                    if (event.clientY + tooltipRect.height > viewportHeight) {
                      tooltip.style("top", `${event.clientY - tooltipRect.height - 10}px`);
                    }
                  })
                  .on("mouseout", (event) => {
                    d3.select(event.currentTarget)
                      .transition()
                      .duration(200)
                      .attr("r", 6)
                      .attr("stroke-width", 2);
                    tooltip.style("display", "none");
                  })
                  .on("click", () => {
                    handleCourtClick(court.id, court.name);
                  });
              }
            });
          }
        }} className="w-full h-full" />
      </div>
    );
  }, [regionName, selectedRegion, handleCourtClick]);

  return (
    <>
      {selectedCourtId ? (
        <div className="mt-8">
          <Breadcrumb
            regionName={regionName}
            courtName={selectedCourtName}
            onCourtBackClick={handleCourtBackClick} 
            onRegionBackClick={handleRegionBackClick} 
          />
          <h2 className="text-3xl font-bold mb-4 mt-4">{selectedCourtName}</h2>
          
          <div className="space-y-6">
            <Dates />
            <Evaluations selectedCourtId={selectedCourtId} />
          </div>
        </div>
      ) : (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-[1250px] mx-auto px-4 py-4">
            <div className="flex flex-col">
              <Breadcrumb
                regionName={regionName}
                onRegionBackClick={handleRegionBackClick} // Только возврат к списку регионов
              />
              <h2 className="text-xl font-medium mt-4">
                {regionName ? regionName : "Выберите регион"}
              </h2>
              {renderRegionMap()}
              

              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600">
                          №
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-bold text-sm text-gray-600">
                          Наименование суда
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600">
                          Общая оценка
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600">
                          Здание
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600">
                          Канцелярия
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600">
                          Процесс
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600">
                          Сотрудники
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600">
                          Судья
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-center font-bold text-sm text-gray-600">
                          Количество отзывов
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRegion?.map((court, index) => (
                        <tr
                          key={court.name}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                            {index + 1}
                          </td>
                          <td
                            className="px-3 py-2.5 text-left text-xs text-gray-600 cursor-pointer hover:text-blue-500"
                            onClick={() =>
                              handleCourtClick(court.id, court.name)
                            }
                          >
                            {court.name}
                          </td>
                          <td className={`border border-gray-300 px-4 py-2 text-center text-sm ${getRatingColor(court.overall)}`}>
                            {court.overall.toFixed(1)}
                          </td>
                          {court.ratings.map((rating: number, idx: number) => (
                            <td
                              key={idx}
                              className={`border border-gray-300 px-4 py-2 text-center text-sm ${getRatingColor(rating)}`}
                            >
                              {rating.toFixed(1)}
                            </td>
                          ))}
                          <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                            {court.totalAssessments}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RegionDetails;