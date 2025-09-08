import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MakeupItem } from '../types/makeup';
import { MakeupItemForm } from './MakeupItemForm';
import { Pencil, Trash2, Calendar, DollarSign, Gift } from 'lucide-react';

interface MakeupItemCardProps {
  item: MakeupItem;
  onUpdate: (id: string, updatedItem: Omit<MakeupItem, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function MakeupItemCard({ item, onUpdate, onDelete }: MakeupItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updatedItem: Omit<MakeupItem, 'id'>) => {
    onUpdate(item.id, updatedItem);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (isEditing) {
    return (
      <MakeupItemForm
        initialData={item}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card className="w-full h-fit">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <p className="text-muted-foreground">{item.brand}</p>
          </div>
          <Badge variant="secondary">{item.type}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {item.shade && (
          <div>
            <p className="text-sm">
              <strong>Cor:</strong> {item.shade}
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(item.purchaseDate)}</span>
            </div>
            {item.wasGift && (
              <div className="flex items-center gap-1 text-pink-600">
                <Gift className="h-4 w-4" />
                <span>Presente</span>
              </div>
            )}
          </div>
          
          <div className="space-y-1 text-sm">
            {item.price > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Preço: {formatPrice(item.price)}</span>
              </div>
            )}
            {!item.wasGift && item.acquisitionPrice > 0 && (
              <div className="flex items-center gap-1 text-green-600">
                <DollarSign className="h-4 w-4" />
                <span>Pago: {formatPrice(item.acquisitionPrice)}</span>
              </div>
            )}
          </div>
        </div>

        {item.notes && (
          <div>
            <p className="text-sm">
              <strong>Observações:</strong>
            </p>
            <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="flex-1"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(item.id)}
          className="flex-1"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}