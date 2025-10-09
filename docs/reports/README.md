# Audit & QA Notes

## Accessibility

- Automated axe-core audit (Playwright) is executed as part of the mobile E2E suite. Critical violations are asserted to be zero when the dialog is open.
- Lighthouse (accessibility category) can be generated locally following the commands in the repository README. Running from the CI container requires setting `CHROME_PATH` to the Playwright Chromium binary and may emit `NO_FCP` warnings when Chrome cannot paint in headless mode.

## Test matrix

| Command | Purpose |
| --- | --- |
| `npm run test` | Unit + interaction tests for the navigation focus trap behaviour. |
| `npm run test:e2e -- --project=mobile-chromium` | Mobile E2E path, mobile dialog assertions, axe-core scan. |
| `npm run test:e2e -- --project=desktop-chromium` | Desktop regression to ensure burger button stays hidden. |
| `npm run test:e2e -- --project=mobile-reduced-motion` | Reduced-motion regression to guarantee parity without animations. |

## Reports

- Playwright traces/videos for failures are stored in `test-results/` when the suite is run with the default reporters.
- Generated Lighthouse JSON (if run successfully) should be committed to this directory for long-term tracking.
