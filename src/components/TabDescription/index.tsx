import React from "react";

interface TabDescriptionProps {
  type: string;
}

const descriptions: Record<
  string,
  { title: string; sections: { heading: string; items?: string[]; text?: string }[] }
> = {
  "http-check": {
    title: "HTTP(S) Проверка",
    sections: [
      { heading: "Назначение", text: "Проверка доступности веб-сервера по HTTP(S)." },
      { heading: "Измеряемые метрики", items: ["Код состояния HTTP", "Время ответа", "Заголовки"] },
      { heading: "Пример использования", text: "Мониторинг доступности сайта." },
    ],
  },
  ping: {
    title: "Ping",
    sections: [
      { heading: "Назначение", text: "Проверка базовой доступности сетевого узла." },
      { heading: "Измеряемые метрики", items: ["Время отклика (RTT)", "Процент потерь пакетов"] },
      { heading: "Пример использования", text: "Проверка связи с сервером." },
    ],
  },
  "tcp-check": {
    title: "TCP Connect",
    sections: [
      { heading: "Назначение", text: "Проверка доступности конкретного TCP-порта." },
      { heading: "Измеряемые метрики", items: ["Факт установления соединения", "Время подключения"] },
      { heading: "Пример использования", text: "Проверка, открыт ли конкретный порт на хосте." },
    ],
  },
  traceroute: {
    title: "Traceroute",
    sections: [
      { heading: "Назначение", text: "Определение сетевого маршрута до целевого хоста." },
      { heading: "Измеряемые метрики", items: ["Цепочка маршрутизаторов (хостов)", "Задержки на каждом переходе (hop)"] },
      { heading: "Пример использования", text: "Диагностика причин высокой сетевой задержки." },
    ],
  },
  "dns-lookup": {
    title: "DNS Lookup",
    sections: [
      { heading: "Назначение", text: "Получение и проверка DNS-записей домена." },
      { heading: "Измеряемые метрики", items: ["IP-адреса (A/AAAA записи)", "Почтовые серверы (MX)", "Серверы имен (NS) и т.д."] },
      { heading: "Пример использования", text: "Проверка корректности настройки A-записи для домена." },
    ],
  },
  info: {
    title: "Информация о хосте",
    sections: [
      { heading: "Назначение", text: "Определение приблизительного физического местоположения сетевого хоста (сервера) на основе его публичного IP-адреса." },
      { heading: "Параметры", items: ["Публичный IPv4 адрес проверяемого узла", "Название страны", "Название административного региона", "Название населенного пункта"] },
      { heading: "Пример использования", text: "Определение страны и города нахождения сервера для оценки сетевых задержек, юрисдикции данных и общей диагностики." },
    ],
  },
};

const TabDescription: React.FC<TabDescriptionProps> = ({ type }) => {
  const data = descriptions[type];
  if (!data) return null;

  return (
    <div className="text-gray-200 py-6 px-4 sm:px-8">
      <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">{data.title}</h3>
      {data.sections.map((section, idx) => (
        <div key={idx} className="mb-4">
          <p className="font-semibold text-[#FF375F] mb-1">{section.heading}:</p>
          {section.text && <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{section.text}</p>}
          {section.items && (
            <ul className="list-disc list-inside text-gray-400 text-sm sm:text-base leading-relaxed space-y-1">
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default TabDescription;
