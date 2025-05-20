import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import EditorContent from "@/components/editor/EditorContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import OpenAI from "openai";
import { systemPrompt } from "@/lib/systemPrompt";

export default function CodeEditor() {
  const [code, setCode] = useState<string>(`func main() {
  let x = 10
  let y = 20
  let result = x + y
  
  if result > 25 {
    print("Result is greater than 25")
  } elif result == 30 {
    print("Result is exactly 30")
  } else {
    print("Result is less than or equal to 25")
  }
  
  // Example of using global variables
  glob MAX_VALUE = 100
  
  // Math functions
  let radius = 5
  let area = 3.14 * radius ^ 2
  let circumference = 2 * 3.14 * radius
  
  // Using math functions
  let angle = 45
  let sinValue = sin(angle)
  let cosValue = cos(angle)
  let tanValue = tan(angle)
  let roundedValue = round(3.14159)
  
  // Example of built-in functions
  let rng = randInt(1, 100)
  let minValue = min(x, y)
  let maxValue = max(x, y)
  
  // Type identifiers
  let n = number
  let t = text
  let l = list
  
  // Method calls
  let message = "Hello, World!"
  let contains = message.contains("Hello")
  let split = message.split(",")
  
  // Property access
  let length = message.textLen
  let uppercase = message.upper
  
  func calculate(a, b) {
    let sum = a + b
    let diff = a - b
    let prod = a * b
    let quot = a / b
    return [sum, diff, prod, quot]
  }
}`);
  
  const [inputValue, setInputValue] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("prompt");
  const [useAzure, setUseAzure] = useState<boolean>(true); // Default to Azure
  const [azureEndpoint, setAzureEndpoint] = useState<string>("https://mistai2.openai.azure.com");
  const [azureDeploymentName, setAzureDeploymentName] = useState<string>("");
  const [azureApiVersion, setAzureApiVersion] = useState<string>("2023-05-15");
  
  const { toast } = useToast();
  
  const handleCodeChange = (value: string) => {
    setCode(value);
  };
  
  const handleCursorActivity = (line: number, ch: number) => {
    // We're not displaying cursor position anymore
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleAzureEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAzureEndpoint(e.target.value);
  };

  const handleAzureDeploymentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAzureDeploymentName(e.target.value);
  };

  const handleAzureApiVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAzureApiVersion(e.target.value);
  };
  
  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };
  
  const handleToggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const handleToggleUseAzure = () => {
    setUseAzure(!useAzure);
  };

  const generateCode = async () => {
    // Validate API key or Azure settings
    if (useAzure) {
      if (!apiKey || !azureEndpoint || !azureDeploymentName) {
        toast({
          title: "Azure OpenAI Settings Required",
          description: "Please enter your Azure OpenAI API key, endpoint, and deployment name.",
          variant: "destructive",
        });
        setActiveTab("settings");
        return;
      }
    } else if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key in the settings tab.",
        variant: "destructive",
      });
      setActiveTab("settings");
      return;
    }

    if (!inputValue.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt for code generation.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      let openaiClient;
      
      // Create OpenAI client with the API key - either standard or Azure
      if (useAzure) {
        openaiClient = new OpenAI({
          apiKey: apiKey,
          baseURL: `${azureEndpoint}/openai/deployments/${azureDeploymentName}`,
          defaultQuery: { 'api-version': azureApiVersion },
          defaultHeaders: { 'api-key': apiKey },
          dangerouslyAllowBrowser: true
        });
      } else {
        openaiClient = new OpenAI({ 
          apiKey,
          dangerouslyAllowBrowser: true
        });
      }
      
      // Using the system prompt from the imported file
      
      // Send request to OpenAI
      const response = await openaiClient.chat.completions.create({
        model: useAzure ? azureDeploymentName : selectedModel, // For Azure, the model is specified in the deployment
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: inputValue
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      // Update the code in the editor
      if (response.choices[0]?.message?.content) {
        setCode(response.choices[0].message.content.trim());
        toast({
          title: "Code Generated",
          description: "The code has been generated successfully!",
        });
      } else {
        throw new Error("No response from the API");
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate code. Please check your API settings and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Code Editor - 70% of the screen height */}
      <div className="h-[70%]">
        <EditorContent 
          code={code} 
          onChange={handleCodeChange} 
          onCursorActivity={handleCursorActivity} 
        />
      </div>
      
      {/* Input Area - 30% of the screen height */}
      <div className="h-[30%] border-t border-gray-300 flex">
        {/* Left panel - 70% of the bottom panel */}
        <div className="w-[70%] p-2 bg-[#f0f0f0]">
          <div className="w-full h-full flex flex-col">
            <div className="flex border-b border-gray-300">
              <button 
                className={`flex-1 py-2 font-medium text-sm ${activeTab === 'prompt' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('prompt')}
              >
                Prompt
              </button>
              <button 
                className={`flex-1 py-2 font-medium text-sm ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
            </div>
            
            <div className="flex-1 relative">
              {activeTab === 'prompt' && (
                <div className="absolute inset-0 flex flex-col">
                  <textarea
                    className="w-full flex-1 p-3 bg-white border border-gray-200 rounded-t font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Write me a fib function..."
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                  <Button 
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-b hover:from-blue-600 hover:to-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={generateCode}
                    disabled={isLoading}
                  >
                    {isLoading ? "Generating..." : "Generate"}
                  </Button>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div className="absolute inset-0 p-4 overflow-y-auto bg-white rounded border border-gray-200">
                  <div className="space-y-6">
                    {/* API Provider Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="apiProvider" className="text-gray-700 font-medium">API Provider</Label>
                      <div className="flex flex-col space-y-2">
                        <div 
                          className={`flex items-center justify-between border p-3 rounded-md cursor-pointer ${!useAzure ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                          onClick={() => setUseAzure(false)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${!useAzure ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            <span className="text-sm font-medium">OpenAI API</span>
                          </div>
                          <span className="text-xs text-gray-500">Use with standard OpenAI API keys</span>
                        </div>
                        
                        <div 
                          className={`flex items-center justify-between border p-3 rounded-md cursor-pointer ${useAzure ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                          onClick={() => setUseAzure(true)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${useAzure ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            <span className="text-sm font-medium">Azure OpenAI</span>
                          </div>
                          <span className="text-xs text-gray-500">Use with Azure OpenAI endpoints</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Standard OpenAI Settings */}
                    {!useAzure && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="apiKey" className="text-gray-700">OpenAI API Key</Label>
                          <div className="flex">
                            <Input
                              id="apiKey"
                              type={showApiKey ? "text" : "password"}
                              placeholder="Enter your OpenAI API key"
                              value={apiKey}
                              onChange={handleApiKeyChange}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleToggleShowApiKey}
                              className="ml-2"
                            >
                              {showApiKey ? "Hide" : "Show"}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="model" className="text-gray-700">Model</Label>
                          <Select value={selectedModel} onValueChange={handleModelChange}>
                            <SelectTrigger id="model">
                              <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gpt-4o">GPT-4o (Latest)</SelectItem>
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                              <SelectItem value="gpt-3.5-turbo-16k">GPT-3.5 Turbo (16k)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    
                    {/* Azure OpenAI Settings */}
                    {useAzure && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="azureApiKey" className="text-gray-700">Azure API Key</Label>
                          <div className="flex">
                            <Input
                              id="azureApiKey"
                              type={showApiKey ? "text" : "password"}
                              placeholder="Enter your Azure OpenAI API key"
                              value={apiKey}
                              onChange={handleApiKeyChange}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleToggleShowApiKey}
                              className="ml-2"
                            >
                              {showApiKey ? "Hide" : "Show"}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="azureEndpoint" className="text-gray-700">Azure Endpoint</Label>
                          <Input
                            id="azureEndpoint"
                            type="text"
                            placeholder="https://your-resource-name.openai.azure.com"
                            value={azureEndpoint}
                            onChange={handleAzureEndpointChange}
                          />
                          <p className="text-xs text-gray-500">Example: https://mistai2.openai.azure.com</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="azureDeploymentName" className="text-gray-700">Deployment Name</Label>
                          <Input
                            id="azureDeploymentName"
                            type="text"
                            placeholder="Enter your model deployment name"
                            value={azureDeploymentName}
                            onChange={handleAzureDeploymentNameChange}
                          />
                          <p className="text-xs text-gray-500">The name of your deployed model in Azure</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="azureApiVersion" className="text-gray-700">API Version</Label>
                          <Input
                            id="azureApiVersion"
                            type="text"
                            placeholder="2023-05-15"
                            value={azureApiVersion}
                            onChange={handleAzureApiVersionChange}
                          />
                          <p className="text-xs text-gray-500">Latest version is 2023-05-15</p>
                        </div>
                      </>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded hover:from-blue-600 hover:to-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={() => setActiveTab("prompt")}
                      >
                        Apply & Return to Prompt
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Code Info Panel - 30% of the bottom panel */}
        <div className="w-[30%] p-4 bg-white border-l border-gray-200 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Language Reference</h3>
          <Separator className="my-2" />
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-indigo-600">Keywords</h4>
              <p className="text-gray-600">if, elif, else, func, let, glob, return, print, for, each</p>
            </div>
            
            <div>
              <h4 className="font-medium text-cyan-600">Math Functions</h4>
              <p className="text-gray-600">sin, cos, tan, round, floor, ceil, abs, log, exp</p>
            </div>
            
            <div>
              <h4 className="font-medium text-amber-600">Built-in Functions</h4>
              <p className="text-gray-600">randInt, randFloat, min, max, avgOf</p>
            </div>
            
            <div>
              <h4 className="font-medium text-purple-600">Type Identifiers</h4>
              <p className="text-gray-600">number, text, list, dict</p>
            </div>
            
            <div>
              <h4 className="font-medium text-green-600">Method Calls</h4>
              <p className="text-gray-600">startsWith, contains, split, add, remove</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
