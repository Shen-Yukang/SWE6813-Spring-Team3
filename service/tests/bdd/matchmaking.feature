Feature: Behavior-aware matchmaking
  As a player
  I want to receive compatible teammates
  So that my match quality improves

  Scenario: Player gets ranked recommendations using skill and behavior
    Given users and profiles exist in the system
    When player "alice" requests matchmaking
    Then the first recommendation should be "bob"

  Scenario: Player gets filtered recommendations by region and game mode
    Given users and profiles exist for filtered matchmaking
    When player "alice" requests matchmaking with region "NA" and game mode "ranked"
    Then the filtered recommendations should only include "bob"
