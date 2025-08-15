import { Select } from '@radix-ui/themes'
import { useGetUserStatesQuery } from '../features/shop/userApiSlice'

type StateSelectProps = {
  value?: string;
}

const StateSelect:React.FC<StateSelectProps> = ({value}: StateSelectProps) => {
  const { data, isLoading, isError, isUninitialized } = useGetUserStatesQuery(undefined);

  if (isLoading || isUninitialized) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading states</div>;
  }

  const {states} = data
  
  return (
    <Select.Root defaultValue={value}>
	<Select.Trigger />
	<Select.Content>
		<Select.Group>
			<Select.Label>State</Select.Label>
            {states.map((state) => (
			<Select.Item key={state.abbr} value={state.abbr}>{state.state}  </Select.Item>
		))}
		</Select.Group>
	</Select.Content>
</Select.Root>
  )
}

export default StateSelect