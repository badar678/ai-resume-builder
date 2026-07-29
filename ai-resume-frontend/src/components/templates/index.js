import ModernTemplate from './ModernTemplate'
import ExecutiveTemplate from './ExecutiveTemplate'

export const TEMPLATE_MAP = {
  modern: ModernTemplate,
  executive: ExecutiveTemplate,
}

// Any existing resume whose templateId no longer matches a key above
// (e.g. an old resume saved with 'minimal', 'creative', 'compact', or
// 'classic' before those templates were removed) safely falls back to
// ModernTemplate instead of crashing or rendering blank.
export const getTemplate = (templateId) => {
  return TEMPLATE_MAP[templateId] || ModernTemplate
}

export {
  ModernTemplate,
  ExecutiveTemplate,
}