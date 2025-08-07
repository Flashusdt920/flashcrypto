import { useState } from 'react';
import { Globe, Plus, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface WhitelistedIP {
  id: string;
  address: string;
  label: string;
  addedAt: Date;
  lastUsed?: Date;
  isCurrent?: boolean;
}

export function IPWhitelist() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [newIP, setNewIP] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [whitelistedIPs, setWhitelistedIPs] = useState<WhitelistedIP[]>([
    {
      id: '1',
      address: '192.168.1.1',
      label: 'Home Network',
      addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      lastUsed: new Date(),
      isCurrent: true,
    },
    {
      id: '2',
      address: '10.0.0.1',
      label: 'Office VPN',
      addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
  ]);
  const { toast } = useToast();

  const validateIP = (ip: string) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part);
      return num >= 0 && num <= 255;
    });
  };

  const handleAddIP = () => {
    if (!validateIP(newIP)) {
      toast({
        title: "Invalid IP Address",
        description: "Please enter a valid IP address (e.g., 192.168.1.1)",
        variant: "destructive",
      });
      return;
    }

    if (!newLabel.trim()) {
      toast({
        title: "Label Required",
        description: "Please provide a label for this IP address",
        variant: "destructive",
      });
      return;
    }

    const newWhitelistedIP: WhitelistedIP = {
      id: Date.now().toString(),
      address: newIP,
      label: newLabel,
      addedAt: new Date(),
    };

    setWhitelistedIPs([...whitelistedIPs, newWhitelistedIP]);
    setNewIP('');
    setNewLabel('');
    
    toast({
      title: "IP Address Added",
      description: `${newIP} has been added to your whitelist`,
    });
  };

  const handleRemoveIP = (id: string) => {
    setWhitelistedIPs(whitelistedIPs.filter(ip => ip.id !== id));
    toast({
      title: "IP Address Removed",
      description: "The IP address has been removed from your whitelist",
    });
  };

  const toggleWhitelist = (enabled: boolean) => {
    setIsEnabled(enabled);
    toast({
      title: enabled ? "IP Whitelist Enabled" : "IP Whitelist Disabled",
      description: enabled 
        ? "Only whitelisted IP addresses can access your account" 
        : "IP whitelist protection has been disabled",
      variant: enabled ? "default" : "destructive",
    });
  };

  return (
    <Card className="bg-black/50 border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-xl font-semibold text-white">IP Whitelist</h3>
            <p className="text-gray-400 text-sm">Restrict account access to specific IP addresses</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="ip-whitelist-toggle" className="text-gray-400 text-sm">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Label>
          <Switch
            id="ip-whitelist-toggle"
            checked={isEnabled}
            onCheckedChange={toggleWhitelist}
          />
        </div>
      </div>

      {isEnabled && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-yellow-300 font-medium text-sm">Warning</p>
              <p className="text-gray-400 text-xs">
                Make sure to add your current IP address before enabling. You may lock yourself out otherwise.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Add New IP */}
        <div className="bg-gray-900/50 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Add IP Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              type="text"
              placeholder="192.168.1.1"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
            <Input
              type="text"
              placeholder="Label (e.g., Home)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
            <Button
              onClick={handleAddIP}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add IP
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your current IP: <span className="text-purple-400 font-mono">192.168.1.1</span>
          </p>
        </div>

        {/* Whitelisted IPs */}
        <div className="space-y-2">
          <h4 className="text-white font-medium">Whitelisted IP Addresses</h4>
          {whitelistedIPs.length === 0 ? (
            <div className="bg-gray-900/50 rounded-lg p-8 text-center">
              <Globe className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No IP addresses whitelisted</p>
              <p className="text-gray-500 text-sm mt-1">Add your first IP address above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {whitelistedIPs.map((ip) => (
                <div
                  key={ip.id}
                  className="bg-gray-900/50 rounded-lg p-3 flex items-center justify-between hover:border-purple-500/30 border border-transparent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono text-sm">{ip.address}</span>
                        {ip.isCurrent && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs">{ip.label}</p>
                      <p className="text-gray-500 text-xs">
                        Added {ip.addedAt.toLocaleDateString()}
                        {ip.lastUsed && ` • Last used ${ip.lastUsed.toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveIP(ip.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Info */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <p className="text-blue-300 font-medium text-sm">Security Note</p>
              <p className="text-gray-400 text-xs mt-1">
                IP whitelisting adds an extra layer of security but may be inconvenient if your IP changes frequently.
                Always keep at least one trusted IP in your whitelist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}