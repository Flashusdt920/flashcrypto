import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TwoFactorSetup } from '@/components/TwoFactorAuth';
import { EmailVerificationBanner } from '@/components/EmailVerification';
import { AntiPhishingSetup } from '@/components/AntiPhishingCode';
import { IPWhitelist } from '@/components/IPWhitelist';
import LoginHistory from '@/components/LoginHistory';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Shield, Settings as SettingsIcon, Globe, History, Bell, Key } from 'lucide-react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [customRpc, setCustomRpc] = useState('');
  const [gasMultiplier, setGasMultiplier] = useState('1.0');
  const [newGasAddress, setNewGasAddress] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch current gas receiver address (admin only)
  const { data: gasReceiverData } = useQuery({
    queryKey: ['/api/admin/gas-receiver'],
    enabled: user?.username === 'admin',
  });

  // Update gas receiver address mutation
  const updateGasReceiver = useMutation({
    mutationFn: async (address: string) => {
      return await apiRequest('/api/admin/gas-receiver', {
        method: 'POST',
        body: JSON.stringify({ address }),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gas-receiver'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gas-fees'] });
      toast({
        title: "Gas Receiver Updated",
        description: "Gas receiver address has been updated successfully",
      });
      setNewGasAddress('');
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update gas receiver address",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (gasReceiverData?.address) {
      setNewGasAddress(gasReceiverData.address);
    }
  }, [gasReceiverData]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Change Password",
      description: "Password change feature will be implemented",
    });
  };

  const handleClearData = () => {
    toast({
      title: "Clear Data",
      description: "Application data cleared successfully",
      variant: "destructive",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-purple-400" />
          Settings
        </h1>
        <ThemeToggle />
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full bg-black/50">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <EmailVerificationBanner email={user?.email} />
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Use dark theme across the application</p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <TwoFactorSetup />
          <AntiPhishingSetup />
          <IPWhitelist />
          <Card className="glass-card border-0">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Network Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customRpc">Custom RPC URL</Label>
              <Input
                id="customRpc"
                type="url"
                value={customRpc}
                onChange={(e) => setCustomRpc(e.target.value)}
                className="bg-primary border-gray-600 focus:border-accent"
                placeholder="https://your-custom-rpc-url.com"
              />
              <p className="text-xs text-muted-foreground">Enter a custom RPC endpoint for blockchain interactions</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gasMultiplier">Gas Price Multiplier</Label>
              <Select value={gasMultiplier} onValueChange={setGasMultiplier}>
                <SelectTrigger className="bg-primary border-gray-600 focus:border-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.0">1.0x (Default)</SelectItem>
                  <SelectItem value="1.1">1.1x (Faster)</SelectItem>
                  <SelectItem value="1.2">1.2x (Fastest)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              Save Network Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Security</h3>
          <div className="space-y-4">
            <Button 
              onClick={handleChangePassword}
              className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
            >
              Change Password
            </Button>
            
            <Button 
              onClick={handleClearData}
              variant="destructive"
              className="w-full"
            >
              Clear Application Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">About</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Version:</strong> 2.0.0</p>
            <p><strong>Build:</strong> 20250108-001</p>
            <p><strong>Developer:</strong> primasoftwares</p>
            <div className="pt-2">
              <button
                onClick={() => window.open('https://t.me/primasoftwares', '_blank')}
                className="text-accent hover:underline"
              >
                <i className="fab fa-telegram mr-2"></i>Contact Support
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {user?.username === 'admin' && (
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Admin Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gasReceiver">Gas Fee Receiver Address</Label>
                <div className="flex space-x-2">
                  <Input
                    id="gasReceiver"
                    type="text"
                    value={newGasAddress}
                    onChange={(e) => setNewGasAddress(e.target.value)}
                    className="bg-primary border-gray-600 focus:border-accent"
                    placeholder="0x..."
                  />
                  <Button 
                    onClick={() => updateGasReceiver.mutate(newGasAddress)}
                    disabled={updateGasReceiver.isPending || !newGasAddress || newGasAddress === gasReceiverData?.address}
                    className="px-6"
                  >
                    {updateGasReceiver.isPending ? 'Updating...' : 'Update'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Configure the wallet address where gas fees will be collected
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
