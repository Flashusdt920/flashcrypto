import { Code, Key, Terminal, BookOpen, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function APIDocs() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
    toast({
      title: "Copied!",
      description: "Code snippet copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Code className="w-10 h-10 text-purple-400" />
          <h1 className="text-4xl font-bold">API Documentation</h1>
          <Badge className="ml-4 bg-green-500/20 text-green-400 border-green-500/30">v2.0</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-purple-900/20 border-purple-500/30 p-4">
            <Key className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-semibold mb-2">Authentication</h3>
            <p className="text-gray-400 text-sm">All API requests require authentication using Bearer tokens</p>
          </Card>
          
          <Card className="bg-purple-900/20 border-purple-500/30 p-4">
            <Terminal className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-semibold mb-2">Base URL</h3>
            <code className="text-purple-300 text-sm">https://api.boltflasher.live/v2</code>
          </Card>
          
          <Card className="bg-purple-900/20 border-purple-500/30 p-4">
            <BookOpen className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-semibold mb-2">Rate Limits</h3>
            <p className="text-gray-400 text-sm">1000 requests per hour per API key</p>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Authentication Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Authentication</h2>
            <Card className="bg-black/50 border-gray-700 p-6">
              <p className="text-gray-300 mb-4">
                To authenticate your requests, include your API key in the Authorization header:
              </p>
              <div className="relative">
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-green-400">
{`Authorization: Bearer YOUR_API_KEY`}
                  </code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth')}
                  className="absolute top-2 right-2"
                >
                  {copiedEndpoint === 'auth' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </Card>
          </section>

          {/* Create Flash Transaction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Create Flash Transaction</h2>
            <Card className="bg-black/50 border-gray-700 p-6">
              <div className="mb-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mr-2">POST</Badge>
                <code className="text-purple-300">/transactions/flash</code>
              </div>
              
              <p className="text-gray-300 mb-4">Create a new flash transaction</p>
              
              <h4 className="text-white font-semibold mb-2">Request Body:</h4>
              <div className="relative mb-4">
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-green-400">
{`{
  "network": "BTC",
  "amount": "1.5",
  "recipient": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "flashFee": "0.225"
}`}
                  </code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(`{
  "network": "BTC",
  "amount": "1.5",
  "recipient": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "flashFee": "0.225"
}`, 'create')}
                  className="absolute top-2 right-2"
                >
                  {copiedEndpoint === 'create' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <h4 className="text-white font-semibold mb-2">Response:</h4>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-blue-400">
{`{
  "transactionId": "tx_abc123xyz",
  "status": "pending",
  "network": "BTC",
  "amount": "1.5",
  "flashFee": "0.225",
  "recipient": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "createdAt": "2025-01-08T10:30:00Z"
}`}
                </code>
              </pre>
            </Card>
          </section>

          {/* Get Transaction Status */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Get Transaction Status</h2>
            <Card className="bg-black/50 border-gray-700 p-6">
              <div className="mb-4">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mr-2">GET</Badge>
                <code className="text-purple-300">/transactions/{`{transactionId}`}</code>
              </div>
              
              <p className="text-gray-300 mb-4">Retrieve the status of a specific transaction</p>
              
              <h4 className="text-white font-semibold mb-2">Response:</h4>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-blue-400">
{`{
  "transactionId": "tx_abc123xyz",
  "status": "completed",
  "network": "BTC",
  "amount": "1.5",
  "recipient": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "txHash": "3b7e72574cc3f6c9f3e4b3d4c5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3",
  "confirmations": 3,
  "completedAt": "2025-01-08T10:35:00Z"
}`}
                </code>
              </pre>
            </Card>
          </section>

          {/* List Transactions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">List Transactions</h2>
            <Card className="bg-black/50 border-gray-700 p-6">
              <div className="mb-4">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mr-2">GET</Badge>
                <code className="text-purple-300">/transactions</code>
              </div>
              
              <p className="text-gray-300 mb-4">List all transactions for the authenticated user</p>
              
              <h4 className="text-white font-semibold mb-2">Query Parameters:</h4>
              <div className="mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 text-gray-400">Parameter</th>
                      <th className="text-left py-2 text-gray-400">Type</th>
                      <th className="text-left py-2 text-gray-400">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 text-purple-300">page</td>
                      <td className="py-2 text-gray-300">integer</td>
                      <td className="py-2 text-gray-300">Page number (default: 1)</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 text-purple-300">limit</td>
                      <td className="py-2 text-gray-300">integer</td>
                      <td className="py-2 text-gray-300">Results per page (default: 10, max: 100)</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 text-purple-300">network</td>
                      <td className="py-2 text-gray-300">string</td>
                      <td className="py-2 text-gray-300">Filter by network (BTC, ETH, USDT, etc.)</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-purple-300">status</td>
                      <td className="py-2 text-gray-300">string</td>
                      <td className="py-2 text-gray-300">Filter by status (pending, completed, failed)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          {/* Error Codes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Error Codes</h2>
            <Card className="bg-black/50 border-gray-700 p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-400">Code</th>
                    <th className="text-left py-2 text-gray-400">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 text-red-400">400</td>
                    <td className="py-2 text-gray-300">Bad Request - Invalid parameters</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 text-red-400">401</td>
                    <td className="py-2 text-gray-300">Unauthorized - Invalid API key</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 text-red-400">403</td>
                    <td className="py-2 text-gray-300">Forbidden - Insufficient permissions</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 text-red-400">404</td>
                    <td className="py-2 text-gray-300">Not Found - Resource doesn't exist</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 text-red-400">429</td>
                    <td className="py-2 text-gray-300">Too Many Requests - Rate limit exceeded</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-red-400">500</td>
                    <td className="py-2 text-gray-300">Internal Server Error</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </section>

          {/* SDKs */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">SDKs & Libraries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-black/50 border-gray-700 p-4">
                <h3 className="text-white font-semibold mb-2">Node.js</h3>
                <code className="text-purple-300 text-sm">npm install @boltflasher/sdk</code>
              </Card>
              <Card className="bg-black/50 border-gray-700 p-4">
                <h3 className="text-white font-semibold mb-2">Python</h3>
                <code className="text-purple-300 text-sm">pip install boltflasher</code>
              </Card>
              <Card className="bg-black/50 border-gray-700 p-4">
                <h3 className="text-white font-semibold mb-2">PHP</h3>
                <code className="text-purple-300 text-sm">composer require boltflasher/sdk</code>
              </Card>
              <Card className="bg-black/50 border-gray-700 p-4">
                <h3 className="text-white font-semibold mb-2">Ruby</h3>
                <code className="text-purple-300 text-sm">gem install boltflasher</code>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}