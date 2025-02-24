'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useSurveyData } from '@/context/SurveyContext';

interface Breadcrumb {
  label: string;
  route: string;
}

const Breadcrumb = () => {
  const pathname = usePathname();
  const { selectedRegion, breadcrumbCourt } = useSurveyData();

  const getBreadcrumbs = (): Breadcrumb[] => {
    const breadcrumbs: Breadcrumb[] = [];

    breadcrumbs.push({
      label: 'Главная',
      route: '/',
    });

    if (pathname.includes('/maps/rayon/District-Courts')) {
      breadcrumbs.push({
        label: 'Средние оценки по районным судам',
        route: '/maps/rayon/District-Courts',
      });
      
      if (breadcrumbCourt) {
        breadcrumbs.push({
          label: breadcrumbCourt,
          route: pathname,
        });
      }
    }

    switch (true) {
      case pathname.includes('/maps/oblast/Regional-Courts'):
        breadcrumbs.push({
          label: 'Средние оценки по областным судам',
          route: '/maps/oblast/Regional-Courts',
        });
        break;

      case pathname.includes('/supreme'):
        breadcrumbs.push({
          label: 'Верховный суд',
          route: '/supreme',
        });
        break;

      case pathname.includes('/general'):
        breadcrumbs.push({
          label: 'Общий свод',
          route: '/general',
        });
        break;

      case pathname.includes('/remarks'):
        breadcrumbs.push({
          label: 'Замечания и предложения',
          route: '/remarks',
        });
        break;
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.route} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-1" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-sm font-medium text-gray-500">
                {breadcrumb.label}
              </span>
            ) : (
              <Link 
                href={breadcrumb.route}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 