import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckCircle, X } from 'lucide-react';
import { ExposureItem } from '@/types';

interface ExposureSelectorProps {
  selectedItems: ExposureItem[];
  onSelectionChange: (items: ExposureItem[]) => void;
  prices?: Record<ExposureItem, number>;
  className?: string;
}

const exposureOptions: {
  value: ExposureItem;
  label: string;
  icon: string;
  description: string;
  defaultPrice: number;
}[] = [
  {
    value: 'golf_bag',
    label: '골프백',
    icon: '🎒',
    description: '골프백에 로고 노출',
    defaultPrice: 15000000,
  },
  {
    value: 'hat',
    label: '모자',
    icon: '🧢',
    description: '모자에 로고 노출',
    defaultPrice: 8000000,
  },
  {
    value: 'shirt',
    label: '상의',
    icon: '👕',
    description: '상의에 로고 노출',
    defaultPrice: 12000000,
  },
  {
    value: 'pants',
    label: '하의',
    icon: '👖',
    description: '하의에 로고 노출',
    defaultPrice: 10000000,
  },
];

export function ExposureSelector({
  selectedItems,
  onSelectionChange,
  prices,
  className
}: ExposureSelectorProps) {
  const [hoveredItem, setHoveredItem] = useState<ExposureItem | null>(null);

  const handleItemToggle = (item: ExposureItem) => {
    const isSelected = selectedItems.indexOf(item) !== -1;
    if (isSelected) {
      onSelectionChange(selectedItems.filter(i => i !== item));
    } else {
      onSelectionChange([...selectedItems, item]);
    }
  };

  const handleRemoveItem = (item: ExposureItem) => {
    onSelectionChange(selectedItems.filter(i => i !== item));
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((total, item) => {
      const price = prices?.[item] || exposureOptions.find(opt => opt.value === item)?.defaultPrice || 0;
      return total + price;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 노출 부위 선택 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📍 노출 부위 선택
        </h3>
        <div className="grid grid-cols-2 gap-4">
        {exposureOptions.map((option) => {
          const isSelected = selectedItems.indexOf(option.value) !== -1;
          const isHovered = hoveredItem === option.value;
            const price = prices?.[option.value] || option.defaultPrice;

            return (
              <div
                key={option.value}
                onClick={() => handleItemToggle(option.value)}
                onMouseEnter={() => setHoveredItem(option.value)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300
                  ${isSelected
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg scale-105'
                    : isHovered
                    ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 shadow-md scale-102'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                {/* 선택 표시 */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* 아이콘과 라벨 */}
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{option.icon}</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {option.label}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>

                {/* 가격 */}
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(price)}
                  </div>
                  <div className="text-xs text-gray-500">
                    / 계약 기간
                  </div>
                </div>

                {/* 호버 효과 */}
                {isHovered && !isSelected && (
                  <div className="absolute inset-0 bg-blue-500/10 rounded-xl pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 선택된 항목들 */}
      {selectedItems.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            선택된 노출 부위
          </h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedItems.map((item) => {
              const option = exposureOptions.find(opt => opt.value === item);
              const price = prices?.[item] || option?.defaultPrice || 0;
              
              return (
                <Badge
                  key={item}
                  variant="success"
                  className="flex items-center space-x-2 px-3 py-2"
                >
                  <span>{option?.icon}</span>
                  <span>{option?.label}</span>
                  <span className="font-semibold">
                    {formatCurrency(price)}
                  </span>
                  <button
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleRemoveItem(item);
                    }}
                    className="ml-1 hover:bg-green-700 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              );
            })}
          </div>

          {/* 총 금액 */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-green-800 dark:text-green-200">
                  총 제안 금액
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(getTotalAmount())}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  {selectedItems.length}개 부위
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
