import { AppText, Card, Screen } from '@/core/design-system';

type FeaturePlaceholderProps = {
	title: string;
	description: string;
};

/** Tela provisória de feature ainda não portada. Sai quando a feature correspondente for entregue. */
function FeaturePlaceholder({ title, description }: FeaturePlaceholderProps) {
	return (
		<Screen>
			<Card>
				<AppText variant="subtitle">{title}</AppText>
				<AppText tone="muted">{description}</AppText>
			</Card>
		</Screen>
	);
}

export { FeaturePlaceholder };
