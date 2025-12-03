import { Cloud, Smile, MessageSquare } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RecommendationFiltersProps {
  filters: {
    byWeather: boolean;
    byMood: boolean;
    byPrompt: boolean;
  };
  onFiltersChange: (filters: { byWeather: boolean; byMood: boolean; byPrompt: boolean }) => void;
  mood: string;
  onMoodChange: (mood: string) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGetRecommendations: () => void;
}

export function RecommendationFilters({
  filters,
  onFiltersChange,
  mood,
  onMoodChange,
  prompt,
  onPromptChange,
  onGetRecommendations,
}: RecommendationFiltersProps) {
  return (
    <Card className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <span className="text-lg">✨</span>
        <h2 className="font-semibold">Pilih Tipe Rekomendasi</h2>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={filters.byWeather}
            onCheckedChange={(checked) =>
              onFiltersChange({ ...filters, byWeather: !!checked })
            }
            className="border-primary data-[state=checked]:bg-primary"
          />
          <Cloud className="h-4 w-4 text-muted-foreground" />
          <span>Berdasarkan Cuaca</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={filters.byMood}
            onCheckedChange={(checked) =>
              onFiltersChange({ ...filters, byMood: !!checked })
            }
            className="border-primary data-[state=checked]:bg-primary"
          />
          <Smile className="h-4 w-4 text-muted-foreground" />
          <span>Berdasarkan Mood</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={filters.byPrompt}
            onCheckedChange={(checked) =>
              onFiltersChange({ ...filters, byPrompt: !!checked })
            }
            className="border-primary data-[state=checked]:bg-primary"
          />
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span>Berdasarkan Prompt</span>
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          placeholder="Masukkan mood anda (senang, sedih, lelah...)"
          value={mood}
          onChange={(e) => onMoodChange(e.target.value)}
          disabled={!filters.byMood}
          className="bg-input border-border placeholder:text-muted-foreground"
        />
        <Input
          placeholder="Masukkan preferensi makanan anda..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          disabled={!filters.byPrompt}
          className="bg-input border-border placeholder:text-muted-foreground"
        />
      </div>

      <Button 
        onClick={onGetRecommendations}
        className="bg-primary hover:bg-primary/90"
      >
        <span className="mr-2">✨</span>
        Dapatkan Rekomendasi
      </Button>
    </Card>
  );
}
