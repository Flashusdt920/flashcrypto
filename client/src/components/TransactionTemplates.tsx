import { useState } from 'react';
import { Save, FileText, Trash2, Copy, Star, Clock, Edit2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TransactionTemplate {
  id: string;
  name: string;
  description?: string;
  network: string;
  recipient: string;
  amount: string;
  isFavorite: boolean;
  lastUsed?: Date;
  usageCount: number;
}

export function TransactionTemplates() {
  const [templates, setTemplates] = useState<TransactionTemplate[]>([
    {
      id: '1',
      name: 'Monthly Payment',
      description: 'Regular monthly payment to supplier',
      network: 'ETH',
      recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3',
      amount: '0.5',
      isFavorite: true,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      usageCount: 12,
    },
    {
      id: '2',
      name: 'Team Salary',
      description: 'Weekly team member payment',
      network: 'USDT',
      recipient: 'TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y',
      amount: '500',
      isFavorite: false,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      usageCount: 8,
    },
    {
      id: '3',
      name: 'Quick Test',
      description: 'Test transaction template',
      network: 'BTC',
      recipient: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      amount: '0.001',
      isFavorite: false,
      lastUsed: new Date(),
      usageCount: 25,
    },
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TransactionTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    network: 'ETH',
    recipient: '',
    amount: '',
  });

  const { toast } = useToast();

  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.recipient || !newTemplate.amount) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const template: TransactionTemplate = {
      id: Date.now().toString(),
      ...newTemplate,
      isFavorite: false,
      usageCount: 0,
    };

    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...template, id: editingTemplate.id } : t));
      toast({
        title: "Template Updated",
        description: "Transaction template has been updated",
      });
    } else {
      setTemplates([...templates, template]);
      toast({
        title: "Template Saved",
        description: "Transaction template has been saved",
      });
    }

    setNewTemplate({
      name: '',
      description: '',
      network: 'ETH',
      recipient: '',
      amount: '',
    });
    setEditingTemplate(null);
    setShowCreateDialog(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast({
      title: "Template Deleted",
      description: "Transaction template has been deleted",
    });
  };

  const toggleFavorite = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    ));
  };

  const useTemplate = (template: TransactionTemplate) => {
    // Update usage stats
    setTemplates(templates.map(t => 
      t.id === template.id 
        ? { ...t, lastUsed: new Date(), usageCount: t.usageCount + 1 }
        : t
    ));
    
    toast({
      title: "Template Applied",
      description: `"${template.name}" template has been loaded`,
    });
  };

  const sortedTemplates = [...templates].sort((a, b) => {
    // Favorites first
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    // Then by usage count
    return b.usageCount - a.usageCount;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-purple-400" />
            Transaction Templates
          </h2>
          <p className="text-gray-400 mt-1">Save and reuse frequent transaction patterns</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Save className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-purple-500/30">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingTemplate ? 'Edit Template' : 'Create Transaction Template'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-white">Template Name *</Label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g., Monthly Payment"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white">Description</Label>
                <Input
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Optional description"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Network *</Label>
                <Select 
                  value={newTemplate.network} 
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, network: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    <SelectItem value="BNB">Binance (BNB)</SelectItem>
                    <SelectItem value="TRX">Tron (TRX)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Recipient Address *</Label>
                <Input
                  value={newTemplate.recipient}
                  onChange={(e) => setNewTemplate({ ...newTemplate, recipient: e.target.value })}
                  placeholder="Enter wallet address"
                  className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                />
              </div>

              <div>
                <Label className="text-white">Amount *</Label>
                <Input
                  value={newTemplate.amount}
                  onChange={(e) => setNewTemplate({ ...newTemplate, amount: e.target.value })}
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    setEditingTemplate(null);
                    setNewTemplate({
                      name: '',
                      description: '',
                      network: 'ETH',
                      recipient: '',
                      amount: '',
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {editingTemplate ? 'Update Template' : 'Save Template'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTemplates.map((template) => (
          <Card
            key={template.id}
            className="bg-black/50 border-purple-500/20 hover:border-purple-500/40 transition-all"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    {template.name}
                    {template.isFavorite && (
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    )}
                  </h3>
                  {template.description && (
                    <p className="text-gray-400 text-sm mt-1">{template.description}</p>
                  )}
                </div>
                <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                  {template.network}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Recipient</p>
                  <p className="text-sm text-gray-300 font-mono truncate">{template.recipient}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-lg font-semibold text-white">
                    {template.amount} {template.network}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {template.lastUsed ? `Last: ${template.lastUsed.toLocaleDateString()}` : 'Never used'}
                </span>
                <span>Used {template.usageCount}x</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => useTemplate(template)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Use
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleFavorite(template.id)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <Star className={`w-4 h-4 ${template.isFavorite ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingTemplate(template);
                    setNewTemplate({
                      name: template.name,
                      description: template.description || '',
                      network: template.network,
                      recipient: template.recipient,
                      amount: template.amount,
                    });
                    setShowCreateDialog(true);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card className="bg-black/50 border-purple-500/20">
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Templates Yet</h3>
            <p className="text-gray-400 mb-4">Create your first transaction template to save time</p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Create Your First Template
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}