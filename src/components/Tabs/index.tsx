import { ReactNode, useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore
import "swiper/css";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeIndex: number;
  onTabChange: (index: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeIndex, onTabChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useSwiper, setUseSwiper] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalWidth = Array.from(container.children).reduce(
      (sum, child) => sum + (child as HTMLElement).offsetWidth + 8,
      0
    );
    setUseSwiper(totalWidth > container.offsetWidth);
  }, [tabs]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full">
        {useSwiper ? (
          <Swiper spaceBetween={8} slidesPerView="auto" freeMode>
            {tabs.map((tab, index) => (
              <SwiperSlide key={index} className="!w-auto">
                <button
                  onClick={() => onTabChange(index)}
                  className={`h-[43px] flex items-center justify-center rounded-[30px] border-2 transition-colors duration-200 whitespace-nowrap min-w-[211px] flex-none ${activeIndex === index
                    ? "border-[#FF375F] text-[#FF375F]"
                    : "border-[#1C202A] text-white"
                    }`}
                >
                  {tab.label}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div ref={containerRef} className="flex gap-2 w-full">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => onTabChange(index)}
                className={`flex-1 h-[43px] flex items-center justify-center rounded-[30px] border-2 transition-colors duration-200 ${activeIndex === index
                  ? "border-[#FF375F] text-[#FF375F]"
                  : "border-[#1C202A] text-white"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full mt-2">{tabs[activeIndex]?.content}</div>
    </div>
  );
};

export default Tabs;
