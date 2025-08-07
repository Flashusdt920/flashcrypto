import { useState } from 'react';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, AlertTriangle, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PriceAlert {
  id: string;
  asset: string;
  condition: 'above' | 'below' | 'crosses';
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  triggered: boolean;
  triggeredAt?: Date;
  notificationMethod: 'email' | 'sms' | 'push' | 'all';
  description?: string;
}

export function PriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      asset: 'BTC',
      condition: 'above',
      targetPrice: 75000,
      currentPrice: 71234,
      isActive: true,
      triggered: false,
      notificationMethod: 'all',
      description: 'Bitcoin breakout alert',
    },
    {
      id: '2',
      asset: 'ETH',
      condition: 'below',
      targetPrice: 2800,
      currentPrice: 3156,
      isActive: true,
      triggered: false,
      notificationMethod: 'email',
      description: 'Buy opportunity',
    },
    {
      id: '3',
      asset: 'BNB',
      condition: 'crosses',
      targetPrice: 350,
      currentPrice: 348.50,
      isActive: false,
      triggered: true,
      triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      notificationMethod: 'push',
      description: 'Price milestone',
    },
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    asset: 'BTC',
    condition: 'above' as const,
    targetPrice: '',
    notificationMethod: 'all' as const,
    description: '',
  });

  const { toast } = useToast();

  const assets = ['BTC', 'ETH', 'USDT', 'BNB', 'TRX', 'SOL', 'ADA', 'DOT'];
  const currentPrices: Record<string, number> = {
    BTC: 71234,
    ETH: 3156,
    USDT: 1.00,
    BNB: 348.50,
    TRX: 0.085,
    SOL: 98.45,
    ADA: 0.62,
    DOT: 7.85,
  };

  const createAlert = () => {
    if (!newAlert.targetPrice) {
      toast({
        title: "Missing Target Price",
        description: "Please enter a target price for the alert",
        variant: "destructive",
      });
      return;
    }

    const alert: PriceAlert = {
      id: Date.now().toString(),
      asset: newAlert.asset,
      condition: newAlert.condition,
      targetPrice: parseFloat(newAlert.targetPrice),
      currentPrice: currentPrices[newAlert.asset],
      isActive: true,
      triggered: false,
      notificationMethod: newAlert.notificationMethod,
      description: newAlert.description,
    };

    setAlerts([...alerts, alert]);
    setNewAlert({
      asset: 'BTC',
      condition: 'above',
      targetPrice: '',
      notificationMethod: 'all',
      description: '',
    });
    setShowCreateDialog(false);

    toast({
      title: "Alert Created",
      description: `Price alert for ${alert.asset} has been created`,
    });
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Deleted",
      description: "Price alert has been removed",
    });
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'above': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'below': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'crosses': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return null;
    }
  };

  const getProgressToTarget = (alert: PriceAlert) => {
    const diff = Math.abs(alert.targetPrice - alert.currentPrice);
    const range = Math.abs(alert.targetPrice);
    return Math.max(0, Math.min(100, 100 - (diff / range) * 100));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-7 h-7 text-purple-400" />
            Price Alerts
          </h2>
          <p className="text-gray-400 mt-1">Get notified when prices reach your targets</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-purple-500/30">
            <DialogHeader>
              <DialogTitle className="text-white">Create Price Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Asset</Label>
                  <Select 
                    value={newAlert.asset} 
                    onValueChange={(value) => setNewAlert({ ...newAlert, asset: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assets.map(asset => (
                        <SelectItem key={asset} value={asset}>
                          {asset} - ${currentPrices[asset].toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Condition</Label>
                  <Select 
                    value={newAlert.condition} 
                    onValueChange={(value: any) => setNewAlert({ ...newAlert, condition: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Price Above</SelectItem>
                      <SelectItem value="below">Price Below</SelectItem>
                      <SelectItem value="crosses">Price Crosses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white">Target Price ($)</Label>
                <Input
                  type="number"
                  value={newAlert.targetPrice}
                  onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Current price: ${currentPrices[newAlert.asset].toLocaleString()}
                </p>
              </div>

              <div>
                <Label className="text-white">Notification Method</Label>
                <Select 
                  value={newAlert.notificationMethod} 
                  onValueChange={(value: any) => setNewAlert({ ...newAlert, notificationMethod: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                    <SelectItem value="all">All Methods</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Description (Optional)</Label>
                <Input
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                  placeholder="e.g., Buy opportunity, Take profit"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createAlert}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Create Alert
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Alerts Count */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/50 border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Alerts</p>
              <p className="text-2xl font-bold text-white">{alerts.length}</p>
            </div>
            <Bell className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
        
        <Card className="bg-black/50 border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-white">
                {alerts.filter(a => a.isActive).length}
              </p>
            </div>
            <Check className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        
        <Card className="bg-black/50 border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Triggered</p>
              <p className="text-2xl font-bold text-white">
                {alerts.filter(a => a.triggered).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {alerts.map(alert => (
          <Card
            key={alert.id}
            className={`bg-black/50 border-purple-500/20 p-4 ${
              alert.triggered ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Asset Info */}
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-purple-400 font-bold">{alert.asset}</span>
                </div>

                {/* Alert Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getConditionIcon(alert.condition)}
                    <span className="text-white font-medium">
                      {alert.condition === 'above' ? 'Above' : alert.condition === 'below' ? 'Below' : 'Crosses'} ${alert.targetPrice.toLocaleString()}
                    </span>
                    {alert.description && (
                      <span className="text-gray-400 text-sm">• {alert.description}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">
                      Current: <span className="text-white">${alert.currentPrice.toLocaleString()}</span>
                    </span>
                    <span className="text-gray-400">
                      Distance: <span className={`${
                        Math.abs(alert.targetPrice - alert.currentPrice) < alert.targetPrice * 0.01
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}>
                        {((Math.abs(alert.targetPrice - alert.currentPrice) / alert.currentPrice) * 100).toFixed(2)}%
                      </span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                      style={{ width: `${getProgressToTarget(alert)}%` }}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  {alert.triggered ? (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      Triggered {alert.triggeredAt?.toLocaleDateString()}
                    </Badge>
                  ) : (
                    <Switch
                      checked={alert.isActive}
                      onCheckedChange={() => toggleAlert(alert.id)}
                    />
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteAlert(alert.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {alerts.length === 0 && (
        <Card className="bg-black/50 border-purple-500/20">
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Price Alerts</h3>
            <p className="text-gray-400 mb-4">Create your first alert to get notified of price changes</p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Alert
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}