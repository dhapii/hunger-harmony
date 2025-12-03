import { ExternalLink } from 'lucide-react';
import { DeliveryLink } from '@/types';
import { Button } from '@/components/ui/button';

interface DeliveryLinksProps {
  links: DeliveryLink;
}

export function DeliveryLinks({ links }: DeliveryLinksProps) {
  const platforms = [
    { name: 'GoFood', url: links.gofoodUrl, color: 'bg-accent hover:bg-accent/90' },
    { name: 'GrabFood', url: links.grabfoodUrl, color: 'bg-accent hover:bg-accent/90' },
    { name: 'ShopeeFood', url: links.shopeefoodUrl, color: 'bg-shopeefood hover:bg-shopeefood/90' },
  ].filter((p) => p.url);

  if (platforms.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => (
        <Button
          key={platform.name}
          size="sm"
          className={`${platform.color} text-white font-medium`}
          asChild
        >
          <a href={platform.url} target="_blank" rel="noopener noreferrer">
            {platform.name}
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      ))}
    </div>
  );
}
