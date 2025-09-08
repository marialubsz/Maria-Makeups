import { useState } from 'react';
import { MakeupItem } from '../types/makeup';
import { MakeupItemCard } from './MakeupItemCard';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Search, Package, DollarSign } from 'lucide-react';

interface MakeupItemListProps {
  items: MakeupItem[];
  onUpdateItem: (id: string, updatedItem: Omit<MakeupItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
}

export function MakeupItemList({ items, onUpdateItem, onDeleteItem }: MakeupItemListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shade.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || item.type === filterType;
    
    const matchesPrice = (() => {
      switch (filterPrice) {
        case 'gifts': return item.wasGift;
        case 'free': return !item.wasGift && item.acquisitionPrice === 0;
        case '0-50': return !item.wasGift && item.acquisitionPrice > 0 && item.acquisitionPrice <= 50;
        case '50-100': return !item.wasGift && item.acquisitionPrice > 50 && item.acquisitionPrice <= 100;
        case '100-200': return !item.wasGift && item.acquisitionPrice > 100 && item.acquisitionPrice <= 200;
        case '200-500': return !item.wasGift && item.acquisitionPrice > 200 && item.acquisitionPrice <= 500;
        case '500+': return !item.wasGift && item.acquisitionPrice > 500;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesType && matchesPrice;
  });

  const uniqueTypes = [...new Set(items.map(item => item.type))].sort();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg mb-2">Nenhum item cadastrado</h3>
        <p className="text-muted-foreground">
          Adicione seu primeiro item de maquiagem usando o formulário acima.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nome, marca ou cor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:block lg:w-48 gap-4">
          <div>
            <Label htmlFor="filterType">Filtrar por tipo</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger id="filterType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filterPrice">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Filtrar por preço
              </div>
            </Label>
            <Select value={filterPrice} onValueChange={setFilterPrice}>
              <SelectTrigger id="filterPrice">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os preços</SelectItem>
                <SelectItem value="gifts">Presentes</SelectItem>
                <SelectItem value="free">Gratuito (R$ 0)</SelectItem>
                <SelectItem value="0-50">Até R$ 50</SelectItem>
                <SelectItem value="50-100">R$ 50 - R$ 100</SelectItem>
                <SelectItem value="100-200">R$ 100 - R$ 200</SelectItem>
                <SelectItem value="200-500">R$ 200 - R$ 500</SelectItem>
                <SelectItem value="500+">Acima de R$ 500</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredItems.length === items.length
          ? `${items.length} ${items.length === 1 ? 'item' : 'itens'} no total`
          : `${filteredItems.length} de ${items.length} ${items.length === 1 ? 'item' : 'itens'}`
        }
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id}>
            <MakeupItemCard
              item={item}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
            />
          </div>
        ))}
      </div>
    </div>
  );
}