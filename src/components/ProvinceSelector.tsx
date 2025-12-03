import { MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { provinces } from '@/data/provinces';

interface ProvinceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProvinceSelector({ value, onChange }: ProvinceSelectorProps) {
  const selectedProvince = provinces.find((p) => p.id === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-auto min-w-[160px] bg-secondary/50 border-border/50 text-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent" />
          <SelectValue placeholder="Pilih Provinsi">
            {selectedProvince?.name || 'Pilih Provinsi'}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[300px] bg-card border-border">
        {provinces.map((province) => (
          <SelectItem 
            key={province.id} 
            value={province.id}
            className="text-foreground hover:bg-secondary"
          >
            {province.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
