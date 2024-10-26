import StateMachine from './StateMachine';

describe('StateMachine', () => {
  it('should have no states', () => {
    const sm = new StateMachine();
    sm.addState('idle');
    expect(sm.isCurrentState('idle')).toBeFalsy();
  });

  it('should set state', () => {
    const player = {
      name: 'Player',
      onEnterIdle: jest.fn().mockName('onEnterIdle'),
    };

    const sm = new StateMachine(player)
      .addState('idle', {
        onEnter: player.onEnterIdle,
      });

    sm.setState('idle');

    expect(sm.isCurrentState('idle')).toBeTruthy();
    expect(player.onEnterIdle).toHaveBeenCalled();
  });

  it('should change state', () => {
    const player = {
      name: 'Player',
      onExitIdle: jest.fn().mockName('onExitIdle'),
      onEnterRun: jest.fn().mockName('onEnterRun')
    };

    const sm = new StateMachine(player)
      .addState('idle', {
        onExit: player.onExitIdle
      })
      .addState('run', {
        onEnter: player.onEnterRun
      });

    sm.setState('idle').setState('run');

    expect(sm.isCurrentState('run')).toBeTruthy();
    expect(player.onExitIdle).toHaveBeenCalled();
    expect(player.onEnterRun).toHaveBeenCalled();
  });

  it('should not change to not exist state', () => {
    const sm = new StateMachine().addState('idle')

    sm.setState('idle').setState('fight');

    expect(sm.isCurrentState('idle')).toBeTruthy();
    expect(sm.isCurrentState('fight')).toBeFalsy();
  });

  it('should update state', () => {
    const player = {
      name: 'Player',
      onUpdateIdle: jest.fn().mockName('onUpdateIdle')
    };

    const sm = new StateMachine(player)
      .addState('idle', {
        onUpdate: player.onUpdateIdle,
      })
      .setState('idle');

    sm.update(100500);

    expect(player.onUpdateIdle).toHaveBeenCalledWith(100500);
  });

  it('should queue state changing', () => {
    const player = {
      name: 'Player',
      onEnterIdle: jest.fn().mockName('onEnterIdle'),
      onEnterRun: jest.fn().mockName('onEnterIdle'),
    };

    const sm = new StateMachine(player)
      .addState('idle', {
        onEnter: player.onEnterIdle
      })
      .addState('run', {
        onEnter: player.onEnterRun
      });

    player.onEnterIdle.mockImplementation(() => {
      sm.setState('run');
    });

    sm.setState('idle');

    expect(sm.isCurrentState('idle')).toBeTruthy();
    expect(player.onEnterIdle).toHaveBeenCalled();
    expect(player.onEnterRun).not.toHaveBeenCalled();

    sm.update(100500);

    expect(sm.isCurrentState('run')).toBeTruthy();
    expect(player.onEnterRun).toHaveBeenCalled();
  });

  it('should return current state name', () => {
    const sm = new StateMachine();
    sm.addState('idle').setState('idle');
    expect(sm.stateName).toEqual('idle');
  });
});
