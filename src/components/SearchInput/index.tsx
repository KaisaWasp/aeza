import React, { KeyboardEvent } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onEnter: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onEnter }) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onEnter();
  };

  return (
    <div className="relative w-full h-[43px]">
      <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#D9D9D9] text-[18px]"></i>
      <input
        type="text"
        placeholder="Имя узла или IP"
        className="w-full h-full pl-10 pr-3 bg-[#1c202a] text-white placeholder-[#485155] rounded-[30px] outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchInput;
