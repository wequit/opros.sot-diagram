"use client";

import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import * as d3 from "d3";
import geoData from "../../../../public/gadm41_KGZ_1.json";

import { FiMinus, FiPlus, FiRefreshCw, FiInfo, FiX } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

interface SVGFeature {
  type: string;
  properties: {
    NAME_1: string;
    GID_1: string;
    GID_0: string;
    COUNTRY: string;
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
    coordinates: number[][][][];
  };
}

const oblastCoordinates: { [key: string]: [number, number] } = {
  Бишкек: [74.69, 42.87],
  "Чуйская область": [74.5, 42.8],
  "Таласская область": [72.2, 42.5],
  "Иссык-Кульская область": [77.5, 42.3],
  "Нарынская область": [75.5, 41.3],
  "Жалал-Абадская область": [72.5, 41.5],
  "Баткенская область": [71.5, 40.0],
  "Ошская область": [73.0, 40.5],
};

interface OblastData {
  id: number;
  name: string;
  ratings: number[];
  overall: number;
  totalAssessments: number;
}

interface MapProps {
  oblastData: OblastData[];
}

type OblastMapping = {
  [key: string]: string;
};

export default function Map_oblast({ oblastData }: MapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 480 });
  const [showLegend, setShowLegend] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { language, getTranslation } = useLanguage();
  
  // Добавляем новый ref для хранения начального состояния карты
  const initialTransformRef = useRef(d3.zoomIdentity);

  // Создаём объект zoom для управления масштабом
  const zoom = useMemo(
    () =>
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 8]) // Ограничиваем масштаб от 1x до 8x
        .touchable(true) // Включаем поддержку сенсорных событий
        .wheelDelta((event) => -event.deltaY * 0.001)
        .filter(event => {
          // Разрешаем только колесико мыши и события клавиатуры
          // Блокируем перетаскивание мышью при масштабе 1 (исходное состояние)
          if (!svgRef.current) return false; // Проверка на null
          const transform = d3.zoomTransform(svgRef.current);
          return event.type === 'wheel' || 
                 event.type === 'dblclick' || 
                 (event.type === 'mousedown' && transform.k > 1);
        })
        .on("zoom", (event) => {
          d3.select(svgRef.current)
            .select(".regions")
            .attr("transform", event.transform);
        }),
    []
  );
  const oblastMapping: OblastMapping = useMemo(
    () => ({
      Biškek: "Город Бишкек",
      Chüy: "Чуйская область",
      Talas: "Таласская область",
      "Ysyk-Köl": "Иссык-Кульская область",
      Naryn: "Нарынская область",
      "Jalal-Abad": "Жалал-Абадская область",
      Batken: "Баткенская область",
      Osh: "Ошская область",
    }),
    []
  );

  const getOblastRating = useCallback(
    (oblastName: string) => {
      const mappedName = oblastMapping[oblastName] || oblastName;
      const oblast = oblastData.find((o) => o.name === mappedName);
      return oblast?.overall || 0;
    },
    [oblastData, oblastMapping]
  );

  const getColor = useCallback((rating: number) => {
    if (!rating) return "#cccccc";
    if (rating >= 4.5) return "#66C266";
    if (rating >= 4.0) return "#B4D330";
    if (rating >= 3.5) return "#FFC04D";
    if (rating >= 3.0) return "#F4A460";
    if (rating >= 2.0) return "#ff8300";
    if (rating >= 1.5) return "#ff620d";
    if (rating >= 1.0) return "#fa5d5d";
    if (rating >= 0.5) return "#640202";
    return "#cccccc";
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = d3.select(containerRef.current);
    const width = container.node()?.getBoundingClientRect().width || 800;
    const height = width * 0.6;

    setDimensions({ width, height });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 1200 600`)
    .attr("preserveAspectRatio", "xMidYMid meet");

    // Центрируем карту
    const projection = d3
      .geoMercator()
      .center([74.7, 41.3]) // Немного скорректированные координаты центра
      .scale(6000)
      .translate([1200 / 2, 600 / 2]);

    const path = d3.geoPath().projection(projection);
   
    
    // Объявляем функцию handleResize в начале useEffect
    const handleResize = () => {
      if (window.innerWidth < 640) {
        svg.select(".legend")?.style("display", "none");
      } else {
        svg.select(".legend")?.style("display", "block");
      }
    };

    // Создаём базовую группу для всего содержимого (важно для правильного порядка слоёв)
    const baseGroup = svg.append("g").attr("class", "base-group");
    
    // Создаём группу для регионов, которая будет трансформироваться при зуме
    const regionsGroup = baseGroup.append("g").attr("class", "regions");
    
    // Улучшенная легенда - теперь добавляем легенду ПОСЛЕ создания группы регионов в базовую группу
    const hasData = oblastData && oblastData.length > 0;
    if (hasData) {
      // Легенда с обновленными размерами
      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(20, 60)`) // Позиция в левой части (left-4)
        .style("opacity", 0)
        .style("display", "none");

      // Добавляем тень для легенды
      svg.append("defs")
        .append("filter")
        .attr("id", "shadow")
        .append("feDropShadow")
        .attr("dx", "0")
        .attr("dy", "2")
        .attr("stdDeviation", "3")
        .attr("flood-opacity", "0.3");

      // Фон с тенью и рамкой
      legend
        .append("rect")
        .attr("width", 190)
        .attr("height", 240) // Возвращаем к прежней высоте, так как кнопки больше нет
        .attr("fill", "white")
        .attr("rx", 10)
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 1)
        .attr("filter", "url(#shadow)")
        .attr("opacity", 0.95);

      // Заголовок
      legend
        .append("text")
        .attr("x", 95)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "700")
        .attr("fill", "#1f2937")
        .text(getTranslation("MapOblast_ScaleTitle", language));
      
      // Разделительная линия
      legend
        .append("line")
        .attr("x1", 15)
        .attr("y1", 35)
        .attr("x2", 175)
        .attr("y2", 35)
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 1);

      const legendData = [
        { color: "#66C266", label: "4.5 - 5.0" },
        { color: "#B4D330", label: "4.0 - 4.4" },
        { color: "#FFC04D", label: "3.5 - 3.9" },
        { color: "#F4A460", label: "3.0 - 3.4" },
        { color: "#ff8300", label: "2.0 - 2.9" },
        { color: "#ff620d", label: "1.5 - 2.0" },
        { color: "#fa5d5d", label: "1.0 - 1.5" },
        { color: "#640202", label: "0.5 - 1.0" },
      ];

      // Создаем элементы легенды
      legend
        .selectAll(".legend-item")
        .data(legendData)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(15, ${i * 24 + 45})`)
        .call((g) => {
          // Цветные прямоугольники
          g.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("rx", 4)
            .attr("fill", (d) => d.color)
            .attr("stroke", "#e5e7eb")
            .attr("stroke-width", 0.5);
          
          // Текст
          g.append("text")
            .attr("x", 28)
            .attr("y", 13)
            .attr("font-size", "13px")
            .attr("fill", "#4B5563")
            .text((d) => d.label);
        });

      // Добавляем обработчик изменения размера экрана
      window.addEventListener("resize", handleResize);
    }

    // Добавляем CSS для анимации областей
    const style = document.createElement('style');
    style.textContent = `
      .region-path {
        transition: all 0.2s ease-in-out;
      }
      .region-path:hover {
        filter: brightness(0.9);
        transform: scale(1.01);
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    // Рисуем области
    regionsGroup
      .selectAll("path")
      .data(geoData.features as SVGFeature[])
      .join("path")
      .attr("d", path as any)
      .attr("class", "region-path")
      .attr("fill", (d: SVGFeature) =>
        hasData ? getColor(getOblastRating(d.properties.NAME_1)) : "#999999"
      )
      .attr("stroke", "#fff")
      .attr("stroke-width", "1")
      .style("cursor", hasData ? "pointer" : "default")
      .on("mouseover", function (event: any, d: SVGFeature) {
        if (!hasData) return;
        d3.select(this).attr("stroke-width", "2");

        const coordinates = getEventCoordinates(event);
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style("display", "block")
          .style("position", "fixed")
          .style("left", `${coordinates.x + 10}px`)
          .style("top", `${coordinates.y + 10}px`);

        const mappedName =
          oblastMapping[d.properties.NAME_1] || d.properties.NAME_1;
        const rating = getOblastRating(d.properties.NAME_1);
        tooltip.html(`
          <div class="font-medium">${mappedName}</div>
          <div class="text-sm text-gray-600">
            Общая оценка: ${formatRating(rating)}
          </div>
        `);
      })
      .on("mousemove", function (event: any) {
        if (!hasData) return;
        const coordinates = getEventCoordinates(event);
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style("left", `${coordinates.x + 10}px`)
          .style("top", `${coordinates.y + 10}px`);
      })
      .on("mouseout", function () {
        if (!hasData) return;
        d3.select(this).attr("stroke-width", "1");
        d3.select(tooltipRef.current).style("display", "none");
      })
      .on("touchstart", function (event: any, d: SVGFeature) {
        if (!hasData) return;
        event.preventDefault();
        d3.select(this).attr("stroke-width", "2");

        const coordinates = getEventCoordinates(event);
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style("display", "block")
          .style("position", "fixed")
          .style("left", `${coordinates.x + 10}px`)
          .style("top", `${coordinates.y + 10}px`);

        const mappedName =
          oblastMapping[d.properties.NAME_1] || d.properties.NAME_1;
        const rating = getOblastRating(d.properties.NAME_1);
        tooltip.html(`
          <div class="font-medium">${mappedName}</div>
          <div class="text-sm text-gray-600">
            Общая оценка: ${formatRating(rating)}
          </div>
        `);
      })
      .on("touchmove", function (event: any) {
        if (!hasData) return;
        event.preventDefault();
        const coordinates = getEventCoordinates(event);
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style("left", `${coordinates.x + 10}px`)
          .style("top", `${coordinates.y + 10}px`);
      })
      .on("touchend", function () {
        if (!hasData) return;
        d3.select(this).attr("stroke-width", "1");
        d3.select(tooltipRef.current).style("display", "none");
      });

    // Добавляем текст с оценками только если данные есть
    if (hasData) {
      regionsGroup
        .selectAll("text")
        .data(geoData.features as SVGFeature[])
        .join("text")
        .attr("x", (d: any) => path.centroid(d)[0])
        .attr("y", (d: any) => path.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("class", "region-label")
        .attr("font-weight", "bold")
        .attr("font-size", width < 640 ? "10px" : "11px") // Адаптивный размер текста
        .style("pointer-events", "none")
        .text((d: SVGFeature) => {
          const rating = getOblastRating(d.properties.NAME_1);
          return rating ? rating.toFixed(1) : "";
        });
    }

    // ВАЖНО: Изменяем код назначения зума, теперь он применяется только к группе регионов
    zoom.on("zoom", (event) => {
      regionsGroup.attr("transform", event.transform);
    });

    // Применяем зум к SVG элементу
    svg.call(zoom);

    // Ограничиваем перемещение карты
    zoom.translateExtent([
      [0, 0], // Минимальные координаты (верхний левый угол)
      [width, height], // Максимальные координаты (нижний правый угол)
    ]);

    // Сохраняем начальное состояние карты
    initialTransformRef.current = d3.zoomIdentity;

    return () => {
      svg.call(zoom.transform, d3.zoomIdentity);
      style.remove(); // Удаляем стили при размонтировании
      window.removeEventListener("resize", handleResize);
    };
  }, [oblastData, getOblastRating, getColor, zoom, language]);

  // Эффект для отслеживания изменений состояния showLegend
  useEffect(() => {
    if (!svgRef.current) return;
    
    const legend = d3.select(svgRef.current).select(".legend");
    
    if (showLegend) {
      legend
        .style("display", "block")
        .transition()
        .duration(300)
        .style("opacity", 1);
    } else {
      legend
        .transition()
        .duration(300)
        .style("opacity", 0)
        .on("end", () => {
          legend.style("display", "none");
        });
    }
  }, [showLegend]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg ref={svgRef} className="w-full h-auto"></svg>
      
      {/* Изменяем кнопку информации, чтобы она выполняла функцию закрытия шкалы */}
      <button
        onClick={() => {
          if (showLegend) {
            // Если шкала открыта, закрываем её
            setShowLegend(false);
          } else {
            // Если шкала закрыта, открываем инфо
            setShowInfo(!showInfo);
          }
        }}
        className="absolute top-4 left-4 z-40 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 text-gray-600 flex items-center gap-2 border border-gray-300"
      >
        {showLegend ? (
          // Отображаем кнопку для закрытия шкалы
          <>
            <FiX className="w-5 h-5" />
            <span className="text-sm">{getTranslation("MapOblast_HideScale", language)}</span>
          </>
        ) : (
          // Отображаем обычную кнопку информации
          <>
            <FiInfo className="w-5 h-5" />  
            <span className="text-sm">{getTranslation("MapOblast_Information", language)}</span>
          </>
        )}
      </button>
      
      {/* Информационное окно */}
      {showInfo && !showLegend && (
        <div className="absolute top-16 left-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200" 
             style={{maxWidth: "320px"}}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-800">{getTranslation("MapOblast_Title", language)}</h3>
            <button 
              onClick={() => setShowInfo(false)} 
              className="text-gray-500 hover:text-gray-700">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="border-t border-gray-200 pt-2 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              {getTranslation("MapOblast_Description", language)}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              {getTranslation("MapOblast_ColorDescription", language)}
            </p>
            <p className="text-sm text-gray-600">
              {getTranslation("MapOblast_ZoomDescription", language)}
            </p>
          </div>
          
          {/* Кнопка для отображения шкалы цветов внутри информационного окна */}
          <button
            onClick={() => {
              setShowLegend(true);
              setShowInfo(false); // Закрываем информационное окно при открытии шкалы
            }}
            className="w-full py-2 px-3 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center justify-center gap-2"
          >
            <FiInfo className="w-4 h-4" />
            <span className="text-sm">{getTranslation("MapOblast_ShowScale", language)}</span>
          </button>
        </div>
      )}
      
      {/* Кнопки зума */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30 ContainerZoomButtons">
        <button
          onClick={() => {
            svgRef.current && d3.select(svgRef.current).call(zoom.scaleBy, 1.2);
          }}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 text-gray-600"
        >
          <FiPlus className="w-7 h-7 ZoomButtons" />
        </button>
        <button
          onClick={() => {
            svgRef.current && d3.select(svgRef.current).call(zoom.scaleBy, 0.8);
          }}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 text-gray-600"
        >
          <FiMinus className="w-7 h-7 ZoomButtons" />
        </button>
        <button
          onClick={() => {
            if (svgRef.current) {
              // Используем сохраненную начальную трансформацию
              d3.select(svgRef.current)
                .transition()
                .duration(300)
                .call(zoom.transform, initialTransformRef.current);
            }
          }}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 text-gray-600"
        >
          <FiRefreshCw className="w-7 h-7 ZoomButtons" />
        </button>
      </div>
      <div
        ref={tooltipRef}
        className="hidden absolute bg-white shadow-lg rounded-md p-2 z-50 pointer-events-none"
        style={{ minWidth: "150px" }}
      ></div>
    </div>
  );
}

function getEventCoordinates(event: any) {
  if (event.touches && event.touches[0]) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }
  if (event.changedTouches && event.changedTouches[0]) {
    return {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
  }
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

// Добавьте функцию для форматирования рейтинга с иконкой звезды
function formatRating(rating: number) {
  return `
    <span class="inline-flex items-center">
      <span class="text-yellow-400 mr-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="14" height="14" fill="currentColor">
          <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
        </svg>
      </span>
      <span class="font-bold">${rating.toFixed(1)}</span>
      <span class="font-bold text-gray-900 ml-1">/</span>
      <span class="font-bold text-gray-900 ml-1">5</span>
    </span>
  `;
}