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
  
  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };
  
  const handleToggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const generateCode = async () => {
    if (!apiKey) {
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
      
      // Create OpenAI client with the API key
      const openai = new OpenAI({ apiKey });
      
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: `You are an expert code generator. Generate only clean, working code without explanations or markdown formatting.
            The code is for a custom language with the following syntax elements:
            
            Keywords: if, elif, else, func, let, glob, return, print, for, each, to, by, in, while, do, break
            Math functions: root, abs, neg, log, exp, round, ceil, floor, sin, cos, tan, asin, acos, atan
            Built-in functions: randInt, randFloat, min, max
            Type identifiers: number, text, list, dict
            Method calls: startsWith, contains, split, add, remove
            Property access: textLen, trim, upper, lower, listLen, keys, values
            
            Operators: +, -, *, /, ^, =, <, >, !, == and other standard operators

            When generating mathematical or algorithmic code, make sure to follow the syntax of this language. 
            Do not generate code in any other language.`
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
        description: error instanceof Error ? error.message : "Failed to generate code. Please check your API key and try again.",
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
        <div className="w-[70%] p-2 bg-[#f0f0f0] flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prompt">Prompt</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="prompt" className="h-[calc(100%-40px)] flex flex-col">
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
            </TabsContent>
            
            <TabsContent value="settings" className="h-[calc(100%-40px)] flex flex-col overflow-y-auto">
              <div className="space-y-4 bg-white p-4 rounded">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">OpenAI API Key</Label>
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
                  <Label htmlFor="model">Model</Label>
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
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                    onClick={() => setActiveTab("prompt")}
                  >
                    Apply & Return to Prompt
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
