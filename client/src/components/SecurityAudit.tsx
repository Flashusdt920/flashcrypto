import { Shield, CheckCircle, Award, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export function SecurityAuditBadge() {
  const auditDate = new Date('2024-12-15');
  const nextAudit = new Date('2025-03-15');
  
  return (
    <Card className="bg-gradient-to-br from-green-900/20 to-black/50 border-green-500/30 p-6">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Shield className="w-16 h-16 text-green-400" />
          <CheckCircle className="w-6 h-6 text-green-500 absolute -bottom-1 -right-1 bg-black rounded-full" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-white">Security Audit Certified</h3>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Verified
            </Badge>
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            Our platform has passed comprehensive security audits by CyberSecure Labs, 
            ensuring the highest standards of data protection and transaction security.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white">SOC 2 Type II Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white">256-bit SSL Encryption</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white">PCI DSS Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white">ISO 27001 Certified</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last Audit: {auditDate.toLocaleDateString()}</span>
            <span>Next Audit: {nextAudit.toLocaleDateString()}</span>
          </div>
          
          <motion.div 
            className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-400">Audit Score</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-400">98/100</span>
                <Badge variant="outline" className="text-green-400 border-green-500/50">
                  Excellent
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Card>
  );
}