/**
 * Trie data structure for efficient prefix-based search completions
 */


export class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  word: string;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.word = '';
  }
}

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Insert a word into the trie
   * @param word - Word to insert
   */
  insert(word: string): void {
    if (!word) return; // Skip empty words
    
    let current = this.root;
    const lowerWord = word.toLowerCase();

    for (const char of lowerWord) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }

    current.isEndOfWord = true;
    current.word = word; // Store the original word with proper casing
  }

  /**
   * Find all words in the trie that start with the given prefix
   * @param prefix - String prefix to search for
   * @param limit - Maximum number of suggestions to return
   * @returns Array of words that start with the prefix
   */
  findCompletions(prefix: string, limit: number = 5): string[] {
    if (!prefix) return [];
    
    const lowerPrefix = prefix.toLowerCase();
    let current = this.root;
    
    // Navigate to the node representing the prefix
    for (const char of lowerPrefix) {
      if (!current.children.has(char)) {
        return []; // Prefix not found
      }
      current = current.children.get(char)!;
    }
    
    const result: string[] = [];
    this._collectWords(current, result, limit);
    return result;
  }

  /**
   * Helper method to collect words from the trie
   * @param node - Current node in the trie
   * @param result - Array to collect the words
   * @param limit - Maximum number of words to collect
   */
  private _collectWords(node: TrieNode, result: string[], limit: number): void {
    if (result.length >= limit) {
      return;
    }

    if (node.isEndOfWord) {
      result.push(node.word);
    }

    // Sort children to ensure deterministic order of results
    const sortedChildren = Array.from(node.children.entries())
      .sort((a, b) => a[0].localeCompare(b[0]));
      
    for (const [, childNode] of sortedChildren) {
      this._collectWords(childNode, result, limit);
      if (result.length >= limit) {
        return;
      }
    }
  }
}