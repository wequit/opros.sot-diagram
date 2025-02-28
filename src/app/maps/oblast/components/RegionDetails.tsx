import { getCookie } from "@/api/login";
import { useSurveyData } from "@/context/SurveyContext";
import React, { useCallback, useState, useMemo, useEffect, useRef } from "react";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import * as d3 from 'd3';
import { GeoPermissibleObjects } from 'd3-geo';
import geoData from '../../../../../public/gadm41_KGZ_1.json';
import districtsGeoData from '../../../../../public/gadm41_KGZ_2.json';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const getRatingColor = (rating: number) => {
  if (rating === 0) return 'bg-gray-100';
  if (rating < 2) return 'bg-red-100image.png';
  if (rating < 2.5) return 'bg-red-100';
  if (rating < 3) return 'bg-orange-100';
  if (rating < 3.5) return 'bg-yellow-100';
  if (rating < 4) return 'bg-emerald-100';
  return 'bg-green-100';
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
  instance?: string;
  assessment?: {
    judge: number;
    process: number;
    staff: number;
    office: number;
    building: number;
  };
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
    'Административный суд Жалал-Абадской области': [73.13, 41.1156]
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
  'Город Бишкек': {
    'Свердловский районный суд': [74.5200, 42.8646],
    'Октябрьский районный суд': [74.6000, 42.9246],
    'Ленинский районный суд': [74.5750, 42.8446],
    'Верховный суд': [74.6012, 42.8800],
    'Административный суд г. Бишкек': [74.5934, 42.9023],
    'Первомайский районный суд': [74.6600, 42.8846],
    'Бишкекский городской суд': [74.5823, 42.8801]
  }
};

// Добавляем типы для сортировки
type SortField = 'overall' | 'judge' | 'staff' | 'process' | 'office' | 'building' | 'count' | null;
type SortDirection = 'asc' | 'desc' | null;

function getEventCoordinates(event: any) {
  if (event.touches && event.touches[0]) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }
  return {
    x: event.clientX,
    y: event.clientY
  };
}

// Обновляем маппинг для русских названий
const districtNamesRu: { [key: string]: string } = {
  'Batken': 'Баткенский районный суд',
  'Kadamjai': 'Кадамжайский районный суд',
  'Lailak': 'Лейлекский районный суд',
  'Ak-Suu': 'Ак-Суйский районный суд',
  'Djety-Oguz': 'Жети-Огузский районный суд',
  'Ysyk-Köl': 'Иссык-Кульский районный суд',
  'Balykchy': 'Балыкчинский районный суд',
  'Ton': 'Тонский районный суд',
  'Tüp': 'Тюпский районный суд',
  'Ak-Talaa': 'Ак-Талинский районный суд',
  'At-Bashi': 'Ат-Башинский районный суд',
  'Jumgal': 'Жумгальский районный суд',
  'Kochkor': 'Кочкорский районный суд',
  'Naryn': 'Нарынский районный суд',
  'Alai': 'Алайский районный суд',
  'Aravan': 'Араванский районный суд',
  'Kara-Suu': 'Кара-Суйский районный суд',
  'Nookat': 'Ноокатский районный суд',
  'Uzgen': 'Узгенский районный суд',
  'Chong-Alay': 'Чон-Алайский районный суд',
  'Bakai-Ata': 'Бакай-Атинский районный суд',
  'Kara-Buura': 'Кара-Буринский районный суд',
  'Manas': 'Манасский районный суд',
  'Talas': 'Таласский районный суд',
  'Ala-Buka': 'Ала-Букинский районный суд',
  'Aksyi': 'Аксыйский районный суд',
  'Bazar-Korgon': 'Базар-Коргонский районный суд',
  'Chatkal': 'Чаткальский районный суд',
  'Nooken': 'Ноокенский районный суд',
  'Suzak': 'Сузакский районный суд',
  'Togus-Toro': 'Тогуз-Тороуский районный суд',
  'Toktogul': 'Токтогульский районный суд',
  'Alamüdün': 'Аламудунский районный суд',
  'Jaiyl': 'Жайылский районный суд',
  'Kemin': 'Кеминский районный суд',
  'Moskovsky': 'Московский районный суд',
  'Panfilov': 'Панфиловский районный суд',
  'Sokuluk': 'Сокулукский районный суд',
  'Chui': 'Чуйский районный суд',
  'Ysyk-Ata': 'Ысык-Атинский районный суд'
};

// Получаем цвет из основной таблицы областей
const getRegionColor = (rating: number, properties?: any): string => {
  // Сначала проверяем, является ли это озером
  if (properties && isLake(properties)) {
    return '#7CC9F0'; // синий цвет для озер
  }
  
  // Остальные цвета остаются без изменений
  if (rating === 0) return '#E5E7EB';
  if (rating < 2) return '#FEE2E2';
  if (rating < 2.5) return '#FEE2E2';
  if (rating < 3) return '#FFEDD5';
  if (rating < 3.5) return '#FEF9C3';
  if (rating < 4) return '#DCFCE7';
  return '#BBF7D0';
};

interface RegionDetailsProps {
  regionName: string | null;
  regions: RegionData[]; // Добавляем пропс regions
}


function isLake(properties: any): boolean {
  return properties.NAME_2 === 'Ysyk-Köl(lake)' || 
         properties.NAME_2 === 'Ysyk-Kol' || 
         properties.NAME_2 === 'Issyk-Kul' ||
         properties.NAME_2 === 'Song-Kol' || 
         properties.NAME_2 === 'Song-Kol(lake)' || 
         properties.NAME_2 === 'Song-kol';
         
}


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

// Определяем маппинг районов прямо в этом файле
const rayonToCourtMapping: { [key: string]: string } = {
  // Бишкек
  'Biskek': 'Бишкекский межрайонный суд',
  
  // Баткенская область
  'Batken': 'Баткенский районный суд',
  'Lailak': 'Лейлекский районный суд',
  'Kadamjai': 'Кадамжайский районный суд',
  'Kyzyl-Kiya': 'Кызыл-Кийский городской суд',
  'Suluktu': 'Сулюктинский городской суд',

  // Чуйская область
  'Alamüdün': 'Аламудунский районный суд',
  'Sokuluk': 'Сокулукский районный суд',
  'Moskovsky': 'Московский районный суд',
  'Jaiyl': 'Жайылский районный суд',
  'Panfilov': 'Панфиловский районный суд',
  'Kemin': 'Кеминский районный суд',
  'Chui': 'Чуйский районный суд',
  'Ysyk-Ata': 'Ысык-Атинский районный суд',
  'Tokmok': 'Токмокский городской суд',

  // Иссык-Кульская область
  'Ak-Suu': 'Ак-Суйский районный суд',
  'Djety-Oguz': 'Джети-Огузский районный суд',
  'Ton': 'Тонский районный суд',
  'Tüp': 'Тюпский районный суд',
  'Ysyk-Köl': 'Иссык-Кульский районный суд',
  'Karakol': 'Каракольский городской суд',
  'Balykchy': 'Балыкчинский городской суд',

  // Нарынская область
  'Ak-Talaa': 'Ак-Талинский районный суд',
  'At-Bashi': 'Ат-Башинский районный суд',
  'Jumgal': 'Жумгальский районный суд',
  'Kochkor': 'Кочкорский районный суд',
  'Naryn': 'Нарынский районный суд',
  'Naryn City': 'Нарынский городской суд',

  // Таласская область
  'Talas': 'Таласский районный суд',
  'Bakai-Ata': 'Бакай-Атинский районный суд',
  'Kara-Buura': 'Кара-Буринский районный суд',
  'Manas': 'Манасский районный суд',
  'Talas City': 'Таласский городской суд',

  // Ошская область
  'Alay': 'Алайский районный суд',
  'Aravan': 'Араванский районный суд',
  'Kara-Kulja': 'Кара-Кульджинский районный суд',
  'Kara-Suu': 'Кара-Суйский районный суд',
  'Nookat': 'Ноокатский районный суд',
  'Uzgen': 'Узгенский районный суд',
  'Chong-Alay': 'Чон-Алайский районный суд',
  'Osh City': 'Ошский городской суд',

  // Джалал-Абадская область
  'Aksy': 'Аксыйский районный суд',
  'Ala-Buka': 'Ала-Букинский районный суд',
  'Bazar-Korgon': 'Базар-Коргонский районный суд',
  'Nooken': 'Ноокенский районный суд',
  'Suzak': 'Сузакский районный суд',
  'Toguz-Toro': 'Тогуз-Тороуский районный суд',
  'Toktogul': 'Токтогульский районный суд',
  'Chatkal': 'Чаткальский районный суд',
  'Jalal-Abad City': 'Джалал-Абадский городской суд',
  'Mailuusuu': 'Майлуу-Сууский городской суд',
  'Tash-Kumyr': 'Таш-Кумырский городской суд',
  'Kara-Kul': 'Кара-Кульский городской суд'
};

const RegionDetails: React.FC<RegionDetailsProps> = ({ regionName, regions }) => {
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

  // Добавляем состояния для сортировки
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Функция обработки сортировки
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc"
      );
      if (sortDirection === "desc") {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Функция для иконок сортировки
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="ml-1 inline-block" />;
    if (sortDirection === "asc")
      return <FaSortUp className="ml-1 inline-block text-blue-600" />;
    return <FaSortDown className="ml-1 inline-block text-blue-600" />;
  };

  // Сортировка данных
  const sortedCourts = useMemo(() => {
    if (!selectedRegion) return [];
    
    return [...selectedRegion].sort((a, b) => {
      if (!sortField || !sortDirection) return 0;
      let aValue: number, bValue: number;
      
      switch (sortField) {
        case "judge":
          aValue = a.ratings[0];
          bValue = b.ratings[0];
          break;
        case "staff":
          aValue = a.ratings[1];
          bValue = b.ratings[1];
          break;
        case "process":
          aValue = a.ratings[2];
          bValue = b.ratings[2];
          break;
        case "office":
          aValue = a.ratings[3];
          bValue = b.ratings[3];
          break;
        case "building":
          aValue = a.ratings[4];
          bValue = b.ratings[4];
          break;
        case "count":
          aValue = a.totalAssessments;
          bValue = b.totalAssessments;
          break;
        case "overall":
          aValue = a.overall;
          bValue = b.overall;
          break;
        default:
          return 0;
      }
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [selectedRegion, sortField, sortDirection]);

  // Добавляем состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтруем суды по поисковому запросу
  const filteredCourts = useMemo(() => {
    if (!searchQuery.trim()) return sortedCourts;
    return sortedCourts.filter(court => 
      court.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sortedCourts]);

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


  const handleCourtBackClick = () => {
    setSelectedCourtId(null);
    setSelectedCourtName(null);
  };

  const handleRegionBackClick = () => {
    setSelectedRegion(null);
  };

  // Добавляем состояние для отображения поиска
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Добавляем функцию для отрисовки карты области
  const renderRegionMap = useCallback(() => {
    if (!regionName || !selectedRegion) return null;

    // Не отображаем границы районов для Бишкека
    const isBishkek = regionName === "Город Бишкек";

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

    // Находим районы текущей области
    const districtFeatures = (districtsGeoData as any).features.filter(
      (feature: any) => feature.properties.NAME_1 === regionMapping[regionName]
    );

    // Выведем все регионы из файла
    console.log("Все регионы в файле:", (geoData as GeoJsonData).features.map(feature => ({
      name: feature.properties.NAME_1,
      type: feature.properties.TYPE_1,
      engtype: feature.properties.ENGTYPE_1
    })));

    // Попробуем найти Бишкек разными способами
    const bishkekFeature = (geoData as GeoJsonData).features.find(
      (feature) => {
        const name = feature.properties.NAME_1;
        console.log("Проверяем регион:", name, feature.properties.TYPE_1);
        return name === "Biškek" || 
               name === "Bishkek" || 
               feature.properties.TYPE_1 === "City" ||
               feature.properties.ENGTYPE_1 === "City";
      }
    );

    if (bishkekFeature) {
      console.log("Нашли Бишкек:", bishkekFeature.properties);
    } else {
      console.log("Бишкек не найден в данных");
    }

    return (
      <div className="w-full h-[400px] relative mb-6 bg-white rounded-lg shadow-sm p-4">
        {/* Обновляем стиль блока с оценкой */}
        <div className="absolute top-4 left-4 bg-white-50 px-4 py-2 rounded-lg shadow-md border border-blue-100 z-10">
          <div className="text-gray-900 text-sm uppercase tracking-wide">
            Общая оценка области
          </div>
          <div className="text-2xl font-semibold" style={{ color: getRegionColor(regions.find(r => r.name === regionName)?.overall || 0) }}>
            {regions.find(r => r.name === regionName)?.overall.toFixed(1) || "Нет данных"}
          </div>
        </div>

        <style>
          {`
            #tooltip {
              pointer-events: none;
              transition: all 0.1s ease;
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

            
            // Рисуем область с цветом на основе общей оценки
            g.append("path")
              .datum(regionFeature as unknown as GeoPermissibleObjects)
              .attr("d", path)
              .attr("fill", () => {
                // Получаем рейтинг из основной таблицы областей
                const regionData = regions.find((r: RegionData) => r.name === regionName);
                return getRegionColor(regionData?.overall || 0);
              })
              .attr("stroke", "#4B5563")
              .attr("stroke-width", 0.8)
              .attr("stroke-opacity", 0.5);

            // Добавляем обработчик для всей карты
            svg.on('mouseleave', function() {
              d3.select('#tooltip').style('display', 'none');
            });

            // Обновляем отрисовку границ районов
            if (!isBishkek) {
              g.selectAll("path.district-border")
                .data(districtFeatures)
                .enter()
                .append("path")
                .attr("class", "district-border")
                .attr("d", path as any)
                .attr("fill", "none")
                .attr("stroke", "#4B5563")
                .attr("stroke-width", 1)
                .attr("pointer-events", "all")
                .on("mouseover", function(event, d: any) {
                  if (isLake(d.properties)) return;
                  
                  d3.select(this).attr("stroke-width", "1.5");
                  
                  const tooltip = d3.select("#tooltip");
                  const coordinates = getEventCoordinates(event);
                  
                  tooltip
                    .style("display", "block")
                    .style("left", `${coordinates.x + 10}px`)
                    .style("top", `${coordinates.y - 10}px`)
                    .html(`
                      <div class="bg-white rounded-lg shadow-lg border border-gray-100 p-3">
                        <div class="font-semibold text-gray-800 mb-1">
                          ${districtNamesRu[d.properties.NAME_2] || d.properties.NAME_2}
                        </div>
                        <div class="text-sm text-gray-600">
                          Общая оценка: ${d.properties.overall ? d.properties.overall.toFixed(1) : 'Нет данных'}
                        </div>
                      </div>
                    `);
                })
                .on("mousemove", function(event) {
                  const coordinates = getEventCoordinates(event);
                  d3.select("#tooltip")
                    .style("left", `${coordinates.x + 10}px`)
                    .style("top", `${coordinates.y - 10}px`);
                })
                .on("mouseout", function() {
                  d3.select(this).attr("stroke-width", "0.5");
                  d3.select("#tooltip").style("display", "none");
                });
                }

            // Сначала рисуем границы Бишкека
            if (regionName === "Город Бишкек") {
              if (bishkekFeature) {
                g.append("path")
                  .datum(bishkekFeature as unknown as GeoPermissibleObjects)
                  .attr("d", path)
                  .attr("fill", () => {
                    const regionData = regions.find(r => r.name === regionName);
                    return getRegionColor(regionData?.overall || 0);
                  })
                  .attr("stroke", "#4B5563")
                  .attr("stroke-width", 1.5)
                  .attr("stroke-opacity", 0.8)
                  .attr("filter", "drop-shadow(0 1px 2px rgb(0 0 0 / 0.15))");
              }
            }

            // Затем рисуем точки
            selectedRegion.forEach((court: RegionData & { coordinates?: [number, number] }) => {
              const position = courtPositions[court.name];
              if (position) {
                const [lon, lat] = position;
                const [x, y] = projection([lon, lat]) || [0, 0];

                const tooltip = d3.select("#tooltip");
                const ratingColor = getRatingColor(court.overall);

                g.append("circle")
                  .attr("cx", x)
                  .attr("cy", y)
                  .attr("r", 6)
                  .attr("fill", getRegionColor(court.overall)) // цвет внутри на основе рейтинга
                  .attr("stroke", "#4B5563") // серая обводка снаружи
                  .attr("stroke-width", 1.5)
                  .attr("class", "cursor-pointer transition-all duration-200")
                  .attr("filter", "drop-shadow(0 1px 1px rgb(0 0 0 / 0.1))")
                  .on("mouseover", (event) => {
                    const coordinates = getEventCoordinates(event);
                    const currentCourtName = court.name;
                    const currentCourt = selectedRegion.find((c: RegionData) => c.name === currentCourtName);
                    
                    if (currentCourt) {
                      tooltip
                        .style("display", "block")
                        .style("position", "fixed")
                        .style("left", `${coordinates.x + 10}px`)
                        .style("top", `${coordinates.y - 10}px`)
                        .html(`
                          <div class="bg-white rounded-lg shadow-lg border border-gray-100 p-3 max-w-[240px]">
                            <div class="font-semibold text-base mb-2 text-gray-800 border-b pb-1.5" style="border-color: #4B5563">
                              ${currentCourt.name}
                            </div>
                            <div class="space-y-1.5">
                              <div class="flex items-center justify-between border-l-2 pl-2" style="border-color: #4B5563">
                                <span class="text-gray-700 text-sm">Общая оценка</span>
                                <span class="font-medium text-gray-900 px-1.5 py-0.5 rounded ${getRatingBgColor(currentCourt.overall)}">
                                  ${currentCourt.overall.toFixed(1)}
                                </span>
                              </div>
                              <div class="flex items-center justify-between border-l-2 pl-2" style="border-color: #4B5563">
                                <span class="text-gray-700 text-sm">Здание</span>
                                <span class="font-medium text-gray-900 px-1.5 py-0.5 rounded ${getRatingBgColor(currentCourt.ratings[4])}">
                                  ${currentCourt.ratings[4].toFixed(1)}
                                </span>
                              </div>
                              <div class="flex items-center justify-between border-l-2 pl-2" style="border-color: #4B5563">
                                <span class="text-gray-700 text-sm">Канцелярия</span>
                                <span class="font-medium text-gray-900 px-1.5 py-0.5 rounded ${getRatingBgColor(currentCourt.ratings[3])}">
                                  ${currentCourt.ratings[3].toFixed(1)}
                                </span>
                              </div>
                              <div class="flex items-center justify-between border-l-2 pl-2" style="border-color: #4B5563">
                                <span class="text-gray-700 text-sm">Процесс</span>
                                <span class="font-medium text-gray-900 px-1.5 py-0.5 rounded ${getRatingBgColor(currentCourt.ratings[2])}">
                                  ${currentCourt.ratings[2].toFixed(1)}
                                </span>
                              </div>
                              <div class="flex items-center justify-between border-l-2 pl-2" style="border-color: #4B5563">
                                <span class="text-gray-700 text-sm">Сотрудники</span>
                                <span class="font-medium text-gray-900 px-1.5 py-0.5 rounded ${getRatingBgColor(currentCourt.ratings[1])}">
                                  ${currentCourt.ratings[1].toFixed(1)}
                                </span>
                              </div>
                              <div class="flex items-center justify-between border-l-2 pl-2" style="border-color: #4B5563">
                                <span class="text-gray-700 text-sm">Судья</span>
                                <span class="font-medium text-gray-900 px-1.5 py-0.5 rounded ${getRatingBgColor(currentCourt.ratings[0])}">
                                  ${currentCourt.ratings[0].toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        `);
                    }
                  })
                  .on("mousemove", (event) => {
                    const coordinates = getEventCoordinates(event);
                    const tooltip = d3.select("#tooltip");
                    tooltip
                      .style("left", `${coordinates.x + 10}px`)
                      .style("top", `${coordinates.y - 10}px`);
                  })
                  .on("mouseout", () => {
                    d3.select("#tooltip").style("display", "none");
                  })
                  .on("click", () => {
                    handleCourtClick(court.id, court.name);
                  });
              }
            });



            // Добавляем красивый тултип
            const tooltip = d3.select('body').append('div')
              .attr('class', 'tooltip-card hidden')
              .style('position', 'absolute')
              .style('pointer-events', 'none')
              .html(`
                <div class="bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                  <h3 class="text-lg font-semibold text-gray-900"></h3>
                  <p class="text-gray-600 mt-1">Общая оценка: <span class="rating"></span></p>
                </div>
              `);

            // Обновляем обработчики событий для районов
            g.selectAll('path')
              .on('mouseover', function(event: any, d: any) {
                if (isLake(d.properties)) return;
                
                const court = selectedRegion.find((c: RegionData) => 
                  c.name.includes(d.properties.NAME_2)
                );
                
                tooltip.classed('hidden', false)
                  .select('h3').text(d.properties.NAME_2);
                tooltip.select('.rating').text(court ? court.overall.toFixed(1) : 'Нет данных');
              })
              .on('mousemove', (event: any) => {
                tooltip
                  .style('left', `${event.pageX + 10}px`)
                  .style('top', `${event.pageY + 10}px`);
              })
              .on('mouseout', () => {
                tooltip.classed('hidden', true);
              });

            // Добавляем текст с оценками в центр каждого района
            const textLabels = g.selectAll("text.rating-label")
              .data(districtFeatures)
              .join("text")
              .attr("class", "rating-label")
              .attr("x", (d: any) => {
                const centroid = path.centroid(d);
                return centroid[0];
              })
              .attr("y", (d: any) => {
                const centroid = path.centroid(d);
                return centroid[1];
              })
              .attr("text-anchor", "middle")
              .attr("dy", ".35em")
              .attr("font-size", "14px")
              .attr("font-weight", "bold")
              .attr("fill", "#000000")
              .text((d: any) => {
                if (isLake(d.properties)) return '';
                
                const courtName = rayonToCourtMapping[d.properties.NAME_2];
                if (!courtName) {
                  console.warn(`Не найден суд для района: ${d.properties.NAME_2}`);
                  return '';
                }
                
                const court = selectedRegion.find((c: RegionData) => c.name === courtName);
                return court ? court.overall.toFixed(1) : '';
              });

            // Обновляем тултип
            g.selectAll("path")
              .on("mouseover", (event: any, d: any) => {
                if (isLake(d.properties)) return;

                const courtName = rayonToCourtMapping[d.properties.NAME_2];
                const court = selectedRegion.find((c: RegionData) => c.name === courtName);
                
                tooltip
                  .style("display", "block")
                  .style("left", `${event.pageX + 10}px`)
                  .style("top", `${event.pageY - 10}px`)
                  .html(`
                    <div class="bg-white rounded-lg shadow-lg border border-gray-100 p-3">
                      <div class="font-semibold text-gray-800 mb-1">
                        ${districtNamesRu[d.properties.NAME_2] || d.properties.NAME_2}
                      </div>
                      <div class="text-sm text-gray-600">
                        Общая оценка: ${court ? court.overall.toFixed(1) : 'Нет данных'}
                      </div>
                    </div>
                  `);
              });
          }
        }} className="w-full h-full" />
      </div>
    );
  }, [selectedRegion, regionName, handleCourtClick]);

  // Обновляем функцию getRatingBgColor для соответствия таблице
  function getRatingBgColor(rating: number): string {
    if (rating === 0) return 'bg-gray-100';
    if (rating < 2) return 'bg-red-100';
    if (rating < 2.5) return 'bg-red-100';
    if (rating < 3) return 'bg-orange-100';
    if (rating < 3.5) return 'bg-yellow-100';
    if (rating < 4) return 'bg-emerald-100';
    return 'bg-green-100';
  }

  // Добавляем refs
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Добавляем dimensions state
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Обработчик изменения размера
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    handleResize(); // Инициализация размеров
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Эффект для очистки тултипов
  useEffect(() => {
    if (regionName === "Город Бишкек") {
      // Удаляем все существующие тултипы при монтировании компонента
      d3.selectAll('.tooltip').remove();
      return;
    }

    // Сначала удаляем все существующие тултипы
    d3.selectAll('.tooltip').remove();

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('display', 'none')
      .style('pointer-events', 'none')
      .style('background', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
      .style('border', '1px solid #e5e7eb')
      .style('z-index', '1000');

    // ... остальной код обработчиков ...

    // Очистка при размонтировании
    return () => {
      // Удаляем все тултипы при размонтировании компонента
      d3.selectAll('.tooltip').remove();
    };
  }, [selectedRegion, regionName]);

  // Добавляем дополнительный эффект для очистки при размонтировании всего компонента
  useEffect(() => {
    return () => {
      // Удаляем все тултипы при размонтировании компонента
      d3.selectAll('.tooltip').remove();
    };
  }, []);

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
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск суда"
                        className="w-full px-4 py-2 mb-4 border-2 border-white-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                          №
                        </th>
                        <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                          Наименование суда
                        </th>
                        <th
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("overall")}
                        >
                          <div className="flex items-center justify-between px-2">
                            <span>Общая оценка</span>
                            {getSortIcon("overall")}
                          </div>
                        </th>
                        <th
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("building")}
                        >
                          <div className="flex items-center justify-between px-2">
                            <span>Здание</span>
                            {getSortIcon("building")}
                          </div>
                        </th>
                        <th
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("office")}
                        >
                          <div className="flex items-center justify-between px-2">
                            <span>Канцелярия</span>
                            {getSortIcon("office")}
                          </div>
                        </th>
                        <th
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("process")}
                        >
                          <div className="flex items-center justify-between px-2">
                            <span>Процесс</span>
                            {getSortIcon("process")}
                          </div>
                        </th>
                        <th
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("staff")}
                        >
                          <div className="flex items-center justify-between px-2">
                            <span>Сотрудники</span>
                            {getSortIcon("staff")}
                          </div>
                        </th>
                        <th
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("judge")}
                        >
                          <div className="flex items-center justify-between px-2">
                            <span>Судья</span>
                            {getSortIcon("judge")}
                          </div>
                        </th>
                        <th
                          className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                          onClick={() => handleSort("count")}
                        >
                          <div className="flex items-center justify-between px-2">
                            <span>Количество отзывов</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourts.map((court, index) => (
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
                          <td className={`border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 ${getRatingColor(court.overall)}`}>
                            {court.overall.toFixed(1)}
                          </td>
                          {court.ratings.map((rating: number, idx: number) => (
                            <td
                              key={idx}
                              className={`border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 ${getRatingColor(rating)}`}
                            >
                              {rating.toFixed(1)}
                            </td>
                          ))}
                          <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                            {court.totalAssessments}
                          </td>
                        </tr>
                      ))}
                      {filteredCourts.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                            {searchQuery ? 'Ничего не найдено' : 'Нет данных'}
                          </td>
                        </tr>
                      )}
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