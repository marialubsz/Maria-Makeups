import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { MakeupItem, MAKEUP_TYPES } from '../types/makeup';

interface MakeupItemFormProps {
  onSubmit: (item: Omit<MakeupItem, 'id'>) => void;
  initialData?: MakeupItem;
  onCancel?: () => void;
}

export function MakeupItemForm({ onSubmit, initialData, onCancel }: MakeupItemFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    brand: initialData?.brand || '',
    type: initialData?.type || '',
    shade: initialData?.shade || '',
    purchaseDate: initialData?.purchaseDate || new Date().toISOString().split('T')[0],
    price: initialData?.price || 0,
    acquisitionPrice: initialData?.acquisitionPrice || 0,
    wasGift: initialData?.wasGift || false,
    notes: initialData?.notes || '',
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.type) return;

    const finalData: Omit<MakeupItem, 'id'> = {
      ...formData,
      price: Number(formData.price),
      acquisitionPrice: formData.wasGift
        ? 0
        : Number(formData.acquisitionPrice) || Number(formData.price),
    };

    onSubmit(finalData);

    if (!initialData) {
      setFormData({
        name: '',
        brand: '',
        type: '',
        shade: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        price: 0,
        acquisitionPrice: 0,
        wasGift: false,
        notes: '',
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Item' : 'Adicionar Novo Item'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Ruby Woo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="Ex: MAC"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {MAKEUP_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shade">Cor/Tom</Label>
              <Input
                id="shade"
                value={formData.shade}
                onChange={(e) => handleChange('shade', e.target.value)}
                placeholder="Ex: Vermelho clássico"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Data de Compra</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleChange('purchaseDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço de Mercado (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="wasGift"
                checked={formData.wasGift}
                onCheckedChange={(checked) => handleChange('wasGift', checked)}
              />
              <Label htmlFor="wasGift">Foi ganhado de presente</Label>
            </div>

            {!formData.wasGift && (
              <div className="space-y-2">
                <Label htmlFor="acquisitionPrice">Preço Pago (R$)</Label>
                <Input
                  id="acquisitionPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.acquisitionPrice}
                  onChange={(e) => handleChange('acquisitionPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Notas sobre o produto, onde comprou, opinião, etc."
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button type="submit" className="flex-1">
            {initialData ? 'Atualizar' : 'Adicionar Item'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
