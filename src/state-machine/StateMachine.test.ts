import StateMachine from './StateMachine';

describe('StateMachine', () => {
  const player = {
    state: '',
    setState: jest.fn().mockName('player.setState()'),
  };

  beforeEach(() => {
    player.state = '';
    player.setState.mockReset();
  });

  it('should have no states', () => {
    const sm = new StateMachine(player);
    sm.addState('idle');
    expect(sm.isCurrentState('idle')).toBeFalsy();
  });

  it('should set state', () => {
    const onEnter = jest.fn().mockName('onEnterIdle');
    const sm = new StateMachine(player).addState('idle', { onEnter });

    sm.setState('idle');

    expect(sm.isCurrentState('idle')).toBeTruthy();
    expect(player.state).toEqual('idle');
    expect(onEnter).toHaveBeenCalled();
  });

  it('should change state', () => {
    const handleExitIdle = jest.fn().mockName('onExitIdle');
    const handleEnterRun = jest.fn().mockName('onEnterRun');

    const sm = new StateMachine(player)
      .addState('idle', { onExit: handleExitIdle })
      .addState('run', { onEnter: handleEnterRun });

    sm.setState('idle').setState('run');

    expect(sm.isCurrentState('run')).toBeTruthy();
    expect(handleExitIdle).toHaveBeenCalled();
    expect(handleEnterRun).toHaveBeenCalled();
  });

  it('should not change to not exist state', () => {
    const sm = new StateMachine(player).addState('idle')

    sm.setState('idle').setState('fight');

    expect(sm.isCurrentState('idle')).toBeTruthy();
    expect(sm.isCurrentState('fight')).toBeFalsy();
  });

  it('should update state', () => {
    const onUpdate = jest.fn().mockName('onUpdateIdle')

    const sm = new StateMachine(player)
      .addState('idle', { onUpdate })
      .setState('idle');

    sm.update(100500);

    expect(onUpdate).toHaveBeenCalledWith(100500);
  });

  it('should queue state changing', () => {
    const onEnterIdle = jest.fn().mockName('onEnterIdle');
    const onEnterRun = jest.fn().mockName('onEnterIdle');

    const sm = new StateMachine(player)
      .addState('idle', { onEnter: onEnterIdle })
      .addState('run', { onEnter: onEnterRun });

    onEnterIdle.mockImplementation(() => {
      sm.setState('run');
    });

    sm.setState('idle');

    expect(sm.isCurrentState('idle')).toBeTruthy();
    expect(onEnterIdle).toHaveBeenCalled();
    expect(onEnterRun).not.toHaveBeenCalled();

    sm.update(100500);

    expect(sm.isCurrentState('run')).toBeTruthy();
    expect(onEnterRun).toHaveBeenCalled();
  });

  it('should return current state name', () => {
    const sm = new StateMachine(player);
    sm.addState('idle').setState('idle');
    expect(sm.currentState).toEqual('idle');
  });
});
