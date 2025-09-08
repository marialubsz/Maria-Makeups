import { useState } from 'react';
import { MakeupItemForm } from './components/MakeupItemForm';
import { MakeupItemList } from './components/MakeupItemList';
import { useMakeupItems } from './hooks/useMakeupItems';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Alert, AlertDescription } from './components/ui/alert';
import { Palette, Plus, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible';

export default function App() {
  const { items, isLoading, error, addItem, updateItem, deleteItem, refreshItems } = useMakeupItems();
  const [showForm, setShowForm] = useState(false);

  const totalValue = items.reduce((sum, item) => sum + item.price, 0);
  const totalSpent = items.reduce((sum, item) => sum + (item.wasGift ? 0 : item.acquisitionPrice), 0);
  const giftCount = items.filter(item => item.wasGift).length;
  
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalValue);
  
  const formattedSpent = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalSpent);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="h-8 w-8 text-primary" />
            <h1>Minha Coleção de Maquiagem</h1>
          </div>
          <p className="text-muted-foreground">
            Organize e acompanhe seus produtos de maquiagem
          </p>
          
          {error && (
            <Alert className="mt-4 max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Erro de conexão - usando dados locais</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={refreshItems}
                  className="ml-2"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {items.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg inline-block space-y-2">
              <p>
                <strong>{items.length}</strong> {items.length === 1 ? 'item' : 'itens'} • 
                Valor total: <strong>{formattedTotal}</strong>
              </p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Gasto real: <strong className="text-foreground">{formattedSpent}</strong></span>
                {giftCount > 0 && (
                  <span>{giftCount} {giftCount === 1 ? 'presente' : 'presentes'}</span>
                )}
              </div>
            </div>
          )}
        </header>

        <div className="space-y-8">
          <Collapsible open={showForm} onOpenChange={setShowForm}>
            <div className="flex justify-center">
              <CollapsibleTrigger asChild>
                <Button className="gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {showForm ? 'Fechar Formulário' : 'Adicionar Novo Item'}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-6">
              <MakeupItemForm
                onSubmit={async (item) => {
                  await addItem(item);
                  setShowForm(false);
                }}
              />
            </CollapsibleContent>
          </Collapsible>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Carregando seus itens...</p>
            </div>
          ) : (items.length > 0 || !showForm) && (
            <>
              <Separator />
              <MakeupItemList
                items={items}
                onUpdateItem={updateItem}
                onDeleteItem={deleteItem}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}