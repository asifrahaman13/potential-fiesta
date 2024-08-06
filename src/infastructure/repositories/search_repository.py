from typing import Dict, List
import requests
from config.config import BING_SEARCH_API_KEY, BING_SEARCH_ENDPOINT


class SearchRepository:

    @staticmethod
    def search_result(search: str) -> List[Dict[str, str]]:

        headers = {"Ocp-Apim-Subscription-Key": BING_SEARCH_API_KEY}
        params = {
            "q": f"{search}",
            "mkt": "en-US",
            "count": 10,
            "responseFilter": "Webpages",
        }

        try:
            response = requests.get(
                BING_SEARCH_ENDPOINT, headers=headers, params=params
            )
            response.raise_for_status()
            result = response.json()
        except requests.RequestException as e:
            result = {"webPages": {"value": []}}

        # Filter results to include only those from the specified domain
        filtered_results = [
            {
                "title": res.get("name"),
                "url": res.get("url"),
                "content": res.get("snippet"),
                "score": rank,
            }
            for rank, res in enumerate(
                result.get("webPages", {}).get("value", []), start=1
            )
        ]

        # Sort results by rank and get the top result
        return filtered_results
