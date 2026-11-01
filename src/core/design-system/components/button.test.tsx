import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button } from './button';

describe('Button', () => {
	it('dispara onPress quando habilitado', async () => {
		const onPress = jest.fn();
		await render(<Button label="Entrar" onPress={onPress} />);

		await fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it('fica ocupado e não dispara durante o carregamento', async () => {
		const onPress = jest.fn();
		await render(<Button label="Entrar" loading onPress={onPress} />);

		await fireEvent.press(screen.getByRole('button'));

		expect(onPress).not.toHaveBeenCalled();
		expect(screen.queryByText('Entrar')).toBeNull();
	});
});
