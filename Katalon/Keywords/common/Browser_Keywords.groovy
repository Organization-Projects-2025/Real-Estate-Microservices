package common

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.webui.driver.DriverFactory
import com.kms.katalon.core.webui.driver.WebUIDriverType
import com.kms.katalon.core.util.KeywordUtil
import org.openqa.selenium.SessionNotCreatedException

class Browser_Keywords {
    
    /**
     * Open browser with fallback mechanism
     * Prioritizes Edge Chromium, falls back to default/Chrome if Edge fails
     */
    @Keyword
    def openBrowserWithFallback() {
        try {
            KeywordUtil.logInfo("Attempting to open Edge Chromium browser...")
            // Try Edge first
            WebUI.openBrowser('', WebUIDriverType.EDGE_CHROMIUM)
            WebUI.maximizeWindow()
        } catch (Exception e) {
            KeywordUtil.logInfo("Edge initialization failed, attempting fallback to default/Chrome...")
            try {
                // Fallback to default (usually Chrome)
                WebUI.openBrowser('')
                WebUI.maximizeWindow()
            } catch (Exception ex) {
                KeywordUtil.markFailed("Failed to open any browser. Edge error: " + e.getMessage() + ". Fallback error: " + ex.getMessage())
                throw ex
            }
        }
    }
}
