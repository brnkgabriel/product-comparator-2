import { iRemoteData } from "./types/index";
import { Util } from "./util";

export class Api extends Util{
  constructor(remoteData: iRemoteData, fbox: any) {
    super(remoteData, fbox)
  }

  
  mobile(str: string) {
    const start = str.indexOf('"products":')
    const products = '{' + str.substring(start, str.length)
    const eIdx = products.indexOf(',"head"')
    return products.substring(0, eIdx - 1) + '}'
  }


  desktop(str: string) {
    var start = str.indexOf('"products":')
    var products = '{' + str.substring(start, str.length)
    var closing_brace_indices = this.braceIndices(products, this.escape("}]"))
    var last_idx = closing_brace_indices[closing_brace_indices.length - 1]
    return products.substring(0, last_idx + 2) + '}'
  }

  braceIndices(str: string, brace: string) {
    var regex = new RegExp(brace, "gi"), result, indices = []
    while ((result = regex.exec(str))) {
      indices.push(result.index)
    }
    return indices
  }

  escape(str: string) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }
  async products(url: string) {
    const response = await fetch(url)
    const text = await response.text()
    // const startIdx = text.indexOf('"products":[{')
    // const productsStr = '{' + text.substring(startIdx, text.length)
    // const closingBraces = this.braceIndices(productsStr, this.escapeStr("}]"))
    // const endIdx = closingBraces[closingBraces.length - 1]
    // const products = productsStr.substring(0, endIdx + 2) + '}'
    const products = this.isMobile ? this.mobile(text) : this.desktop(text)
    let skus: any[] = []
    try {
      localStorage.setItem("apiProducts", products)
      const parsed = JSON.parse(products).products
      skus = parsed
    } catch (error) {
      console.info(error)
      skus = []
    }
    return skus
  }
  
  escapeStr(str: string) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }
}