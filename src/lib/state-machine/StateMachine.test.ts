import StateMachine from './StateMachine';

describe('StateMachine', () => {
  type GameObject = {
    state: string | number;
  };

  let gameObject: GameObject;

  beforeEach(() => {
    gameObject = {state: ''};
  });

  let stateMachine: StateMachine<GameObject>;

  beforeEach(() => {
    stateMachine = new StateMachine(gameObject);
  });

  it('should have no states', () => {
    const sm = new StateMachine(gameObject);
    sm.addState('idle');
    expect(sm.currentState).toEqual('');
  });

  it('should set state', () => {
    const onEnter = jest.fn().mockName('onEnterIdle');

    stateMachine
      .addState('idle', { onEnter })
      .setState('idle');

    expect(stateMachine.currentState).toEqual('idle');
    expect(gameObject.state).toEqual('idle');
    expect(onEnter).toHaveBeenCalled();
  });

  it('should change state', () => {
    const handleExitIdle = jest.fn().mockName('onExitIdle');
    const handleEnterRun = jest.fn().mockName('onEnterRun');

    stateMachine
      .addState('idle', { onExit: handleExitIdle })
      .addState('run', { onEnter: handleEnterRun })
      .setState('idle')
      .setState('run');

    expect(stateMachine.currentState).toEqual('run');
    expect(handleExitIdle).toHaveBeenCalled();
    expect(handleEnterRun).toHaveBeenCalled();
  });

  it('should not change to not exist state', () => {
    stateMachine
      .addState('idle')
      .setState('idle')
      .setState('fight');

    expect(stateMachine.currentState).toEqual('idle');
  });

  it('should update state', () => {
    const onUpdate = jest.fn().mockName('onUpdateIdle')

    stateMachine
      .addState('idle', { onUpdate })
      .setState('idle')
      .update(100500, 1);

    expect(onUpdate).toHaveBeenCalledWith(100500, 1);
  });

  it('should queue state changing', () => {
    const onEnterRun = jest.fn().mockName('onEnterIdle');
    const onEnterIdle = jest.fn().mockName('onEnterIdle').mockImplementation(() => stateMachine.setState('run'));

    stateMachine
      .addState('idle', { onEnter: onEnterIdle })
      .addState('run', { onEnter: onEnterRun })
      .setState('idle');

    expect(stateMachine.currentState).toEqual('idle');
    expect(onEnterIdle).toHaveBeenCalled();
    expect(onEnterRun).not.toHaveBeenCalled();

    stateMachine.update(100500, 1);

    expect(stateMachine.currentState).toEqual('run');
    expect(onEnterRun).toHaveBeenCalled();
  });
});
