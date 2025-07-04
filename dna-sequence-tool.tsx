"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, RotateCcw, Shuffle, FlipHorizontal, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DNASequenceTool() {
  const [inputSequences, setInputSequences] = useState("")
  const [outputSequences, setOutputSequences] = useState("")
  const [operation, setOperation] = useState("")
  const { toast } = useToast()

  // DNA序列处理函数 - 支持IUPAC核酸代码
  const getComplement = (base: string): string => {
    const complementMap: { [key: string]: string } = {
      // 标准碱基
      A: "T",
      T: "A",
      C: "G",
      G: "C",
      a: "t",
      t: "a",
      c: "g",
      g: "c",

      // IUPAC核酸代码
      K: "M",
      M: "K", // K=G/T ↔ M=A/C
      R: "Y",
      Y: "R", // R=A/G ↔ Y=C/T
      S: "S", // S=C/G (自互补)
      W: "W", // W=A/T (自互补)
      B: "V",
      V: "B", // B=C/G/T ↔ V=A/C/G
      D: "H",
      H: "D", // D=A/G/T ↔ H=A/C/T
      N: "N", // N=A/C/G/T (自互补)

      // 小写版本
      k: "m",
      m: "k",
      r: "y",
      y: "r",
      s: "s",
      w: "w",
      b: "v",
      v: "b",
      d: "h",
      h: "d",
      n: "n",
    }
    return complementMap[base] || base
  }

  const reverseSequence = (sequence: string): string => {
    return sequence.split("").reverse().join("")
  }

  const complementSequence = (sequence: string): string => {
    return sequence
      .split("")
      .map((base) => getComplement(base))
      .join("")
  }

  const reverseComplementSequence = (sequence: string): string => {
    return reverseSequence(complementSequence(sequence))
  }

  // 处理序列操作
  const processSequences = (operationType: string) => {
    if (!inputSequences.trim()) {
      toast({
        title: "输入为空",
        description: "请先输入DNA序列",
        variant: "destructive",
      })
      return
    }

    const lines = inputSequences.split("\n").filter((line) => line.trim())
    const processedLines: string[] = []

    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      // 检查是否包含有效的DNA碱基（包括IUPAC代码）
      const dnaPattern = /[ATCGKMRYSWBDHVNatcgkmryswbdhvn]/
      if (!dnaPattern.test(trimmedLine)) {
        processedLines.push(trimmedLine) // 保持原样
        return
      }

      let result = ""
      switch (operationType) {
        case "reverse":
          result = reverseSequence(trimmedLine)
          break
        case "complement":
          result = complementSequence(trimmedLine)
          break
        case "reverse-complement":
          result = reverseComplementSequence(trimmedLine)
          break
        default:
          result = trimmedLine
      }
      processedLines.push(result)
    })

    setOutputSequences(processedLines.join("\n"))
    setOperation(operationType)
  }

  // 复制到剪贴板
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "复制成功",
        description: `${type}已复制到剪贴板`,
      })
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      })
    }
  }

  // 清空输入
  const clearInput = () => {
    setInputSequences("")
    setOutputSequences("")
    setOperation("")
  }

  // 获取操作名称
  const getOperationName = (op: string) => {
    const names: { [key: string]: string } = {
      reverse: "反向",
      complement: "互补",
      "reverse-complement": "反向互补",
    }
    return names[op] || ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DNA序列处理工具
          </h1>
          <p className="text-lg text-muted-foreground">批量处理DNA序列</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                输入序列
                <Badge variant="outline" className="text-xs">
                  支持多行
                </Badge>
              </CardTitle>
              <CardDescription>粘贴您的DNA序列，每行一个序列。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="请输入DNA序列，例如：&#10;ATCGATCGATCG&#10;GCTAGCTAGCTA&#10;TTAACCGGTTAA&#10;&#10;支持从Excel复制多行数据..."
                value={inputSequences}
                onChange={(e) => setInputSequences(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(inputSequences, "输入序列")}
                  disabled={!inputSequences.trim()}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  复制输入
                </Button>
                <Button variant="outline" size="sm" onClick={clearInput} disabled={!inputSequences.trim()}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 输出区域 */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                输出结果
                {operation && <Badge variant="secondary">{getOperationName(operation)}</Badge>}
              </CardTitle>
              <CardDescription>处理后的序列结果，可直接复制到Excel中。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="处理结果将显示在这里..."
                value={outputSequences}
                readOnly
                className="min-h-[200px] font-mono text-sm bg-muted/50"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(outputSequences, "输出结果")}
                  disabled={!outputSequences.trim()}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  复制结果
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 操作按钮 */}
        <Card className="border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-background to-muted/20">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">选择操作</h3>
              <p className="text-sm text-muted-foreground">点击按钮处理您的DNA序列</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => processSequences("reverse")}
                disabled={!inputSequences.trim()}
                className="h-20 flex flex-col items-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
              >
                <FlipHorizontal className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">反向</div>
                  <div className="text-xs opacity-90">ATCG → GCTA</div>
                </div>
              </Button>

              <Button
                onClick={() => processSequences("complement")}
                disabled={!inputSequences.trim()}
                className="h-20 flex flex-col items-center gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
              >
                <Shuffle className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">互补</div>
                  <div className="text-xs opacity-90">ATCG → TAGC</div>
                </div>
              </Button>

              <Button
                onClick={() => processSequences("reverse-complement")}
                disabled={!inputSequences.trim()}
                className="h-20 flex flex-col items-center gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0"
              >
                <RotateCcw className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">反向互补</div>
                  <div className="text-xs opacity-90">ATCG → CGAT</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
