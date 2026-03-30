import React from 'react';

interface LiveMapProps {
  pickup?: string;
  destination?: string;
  className?: string;
}

const LiveMap: React.FC<LiveMapProps> = ({
  pickup,
  destination,
  className = "h-full w-full"
}) => {
  const companyAddress = "Espenschiedstraße 1, 55411 Bingen am Rhein, Germany";

  const startPoint = pickup?.trim() ? pickup : companyAddress;
  const endPoint = destination?.trim() ? destination : "";

  const searchQuery = endPoint
    ? `${startPoint} to ${endPoint}`
    : startPoint;

  const encodedQuery = encodeURIComponent(searchQuery);

  return (
    <div className={`overflow-hidden rounded-[30px] bg-gray-100 border border-gray-200 ${className}`}>
      <iframe
        title="Live Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${encodedQuery}&output=embed`}
      />
    </div>
  );
};

export default LiveMap;