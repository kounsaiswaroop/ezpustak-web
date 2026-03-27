import { Badge } from "./ui/badge";

export function ConditionBadge({ condition }: { condition: string }) {
  switch (condition) {
    case 'like_new':
      return <Badge variant="success">Like New</Badge>;
    case 'good':
      return <Badge variant="info">Good</Badge>;
    case 'fair':
      return <Badge variant="warning">Fair</Badge>;
    case 'poor':
      return <Badge variant="error">Poor</Badge>;
    default:
      return <Badge>{condition.replace('_', ' ')}</Badge>;
  }
}
